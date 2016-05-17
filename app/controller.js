import q from 'q';
import Wishlist from './models/wishlist';
import * as _ from 'lodash';

function _doAddItem(item) {
	var deferred = q.defer();
	var wishItem = new Wishlist(item);
	wishItem.save((err, addedItem) => {
		if (err) {
			return deferred.reject(err);
		}
		return deferred.resolve(addedItem);
	});
	return deferred.promise;
}

export function	addItem(req, res) {
	var data = req.body;
	
	_doAddItem({
		user: data.user._id,
		product: data.product._id,
		variation: data.variation
	})
	.then(
		(item) => { return res.json(item); },
		(err) => { return res.status(400).json({ message: 'Unable to add item' }); }
	);
}

export function	getItems(req, res) {
	var user = req.params.userId;

	Wishlist.find({ user })
	.exec((err, list) => {
		if (err) {
			return res.status(400).json({ message: 'Cannot get list of items' });
		}
		return res.json(list);
	});
}

export function itemExisted(req, res) {
	var user = req.params.userId;
	var product = req.body.product._id;
	var variations = req.body.variations;

	Wishlist.find({ user, product })
	.exec((err, list) => {
		if (err) {
			return res.status(400).json({ message: 'Cannot get list of items' });
		}

		if (variations) {
			const existedVariations = _.map(variations, (variation) => {
				const matchedItem = _.find(list, (item) => {
					return _.isEqual(item.variation, variation);
				});
				return {
					variation: variation,
					wishlistExisted: !!matchedItem
				};
			});
			return res.json(existedVariations);
		} else if (!!list) {
			return res.json([{
				variation: {},
				wishlistExisted: true
			}]);
		}
	});
}
