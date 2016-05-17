'use strict';


var mongoose = require('mongoose'),
	Order = mongoose.model('Order'),
	_ = require('lodash'),
	moment = require('moment');

exports.validate = function(order) {
	return order instanceof Order;
};

function wholeNumberWithCommas(x) {
    var parts = x.toString().split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts[0];
}

exports.fns = {
	paymentMethod: function(order) {
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
	code: function(order) {
		return order.code;
	},
	subtotal: function(order) {
		return wholeNumberWithCommas(order.paymentSummary.subtotal);
	},
	shippingCost: function(order) {
		return wholeNumberWithCommas(order.paymentSummary.shipping);
	},
	accountCreditUsed: function(order) {
		return order.paymentSummary.accountCredit ? wholeNumberWithCommas(order.paymentSummary.accountCredit) : 0;
	},
	total: function(order) {
		return wholeNumberWithCommas(order.paymentSummary.total);
	},
	shippingAddress: function(order) {
		var shippingAddress = order.address.shipping;

		return {
			fullName: shippingAddress.firstName + ' ' + shippingAddress.lastName,
			address1: shippingAddress.address1,
			address2: shippingAddress.address2,
			district: shippingAddress.district.name,
			city: shippingAddress.city.name,
		};

	},
	deliveryDate: function(order) {
		if (_.isUndefined(order.tracking) || _.isUndefined(order.tracking.deliveryDate)) {
			return '';
		}
		else {
			return moment(order.tracking.deliveryDate).format('MMM D, YYYY');
		}
	},
	trackingLink: function(order) {
		if (_.isUndefined(order.tracking) || _.isUndefined(order.tracking.GHN)) {
			return '';
		}
		else {
			return 'https://ontime.ghn.vn/Tracking/ViewTracking/' + order.tracking.GHN;
		}
	},
	items: function(order) {
		return order.products.map(function(item) {
			var details = [];
			if (item.variation) {
				_.forEach(item.variation, function(value, key) {
					details.push(key + ': ' + value);
				});
			}
			details = details.join(', ');

			return {
				name: item.product._vn.name,
				details: details,
				quantity: item.quantity,
				priceEach: wholeNumberWithCommas(item.salePrice),
			};
		});
	},

};