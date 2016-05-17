import * as _ from 'lodash';
import * as moment from 'moment';

let SHIPPING_LIST = ['Convenience - Dislike', 'Convenience - Size/Fit'];



function wholeNumberWithCommas(x: number): string {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts[0];
}

export let fns = {
	code: function(order: any): string {
		return order.code;
	},
	subtotal: function(order: any): string {
		return wholeNumberWithCommas(order.paymentSummary.subtotal);
	},
	shippingCost: function(order: any): string {
		return wholeNumberWithCommas(order.paymentSummary.shipping);
	},
	accountCreditUsed: function(order: any): string {
		return order.paymentSummary.accountCredit ? wholeNumberWithCommas(order.paymentSummary.accountCredit) : '0';
	},
	total: function(order: any): string {
		return wholeNumberWithCommas(order.paymentSummary.total);
	},
	shippingAddress: function(order: any): object {
		var shippingAddress = order.address.shipping;

		return {
			fullName: shippingAddress.lastName + ' ' + shippingAddress.firstName,
			address1: shippingAddress.address1,
			address2: shippingAddress.address2,
			district: shippingAddress.district.name,
			city: shippingAddress.city.name,
			phone: shippingAddress.phone
		};

	},
	returnAddress: function(order: any): object {
		var returnAddress = order.address.return;
		if (!returnAddress) { return {}; }

		return {
			fullName: returnAddress.lastName + ' ' + returnAddress.firstName,
			address1: returnAddress.address1,
			address2: returnAddress.address2,
			district: returnAddress.district.name,
			city: returnAddress.city.name,
		};
	},
	returnService: function(order: any) {
		return order.returnService;
	},
	deliveryDate: function(order: any): string {
		if (_.isUndefined(order.tracking) || _.isUndefined(order.tracking.deliveryDate)) {
			return '';
		}
		else {
			return moment(order.tracking.deliveryDate).format('MMM D, YYYY');
		}
	},
	trackingLink: function(order: any): string {
		if (_.isUndefined(order.tracking) || _.isUndefined(order.tracking.GHN)) {
			return '';
		}
		else {
			if (order.tracking.selected3PL === 'NJV') {
				return 'https://www.ninjavan.co/vn-vn?tracking_id=' + order.tracking.GHN;
			} else if (order.tracking.selected3PL === 'VTL') {
				return 'http://www.viettelpost.com.vn/Tracking?KEY=' + order.tracking.GHN;
			} else {
				return 'https://5sao.ghn.vn/Tracking/ViewTracking/' + order.tracking.GHN;
			}
		}
	},
	returnTrackingLink: function(order: any): string {
		if (_.isUndefined(order.tracking) || _.isUndefined(order.tracking.return) || _.isUndefined(order.tracking.return.trackingId)) {
			return '';
		} else {
			return 'https://5sao.ghn.vn/Tracking/ViewTracking/' + order.tracking.return.trackingId;
		}
	},
	items: function(order: any): Array<any> {
		return _.map(order.products, (item: any) => {
			let details: Array<any> = [];
			if (item.variation) {
				_.forEach(item.variation, (value, key) => {
					details.push(key + ': ' + value);
				});
			}

			return {
				name: item.product.name,
				details: details.join(', '),
				quantity: item.quantity,
				priceEach: wholeNumberWithCommas(item.salePrice),
				returns: item.returns
			};
		});
	},
	paymentMethod: function(order: any): string {
		if (order.paymentSummary.method === 'COD') {
			return 'Thanh toán khi nhận hàng';
		}
		else if (order.paymentSummary.method === 'CC') {
			return 'Đã thanh toán bằng thẻ tín dụng';
		}
		else {
			return order.paymentSummary.method;
		}
	},
	pickupableBy3PL: function(order: any): boolean {
		return order.pickupBy3PL;
	},
	bankTransferRefund: function(order: any): boolean {
		return order._refundType && order._refundType === 'bankTransfer';
	},
	isCODPayment: function(order: any): boolean {
		return order.paymentSummary.method === 'COD';
	},
	hasNonReturnedItem: function(order: any): boolean {
		return _.some(order.products, (product: any) => { return !product.returns; });
	},

	hasConvenienceReturnedItem: function(order: any): boolean {
		return _.some(order.products, (product: any) => { return !!product.returnReason && SHIPPING_LIST.indexOf(product.returnReason) > -1; });
	}
};