'use strict';

/**
 * Module dependencies.
 */
 import mongoose from 'mongoose';
 var Schema = mongoose.Schema;

/**
 * Wishlist Schema
 */
var WishlistSchema = new Schema({
	user: {
		type: Schema.ObjectId,
	},
	product: {
		type: Schema.ObjectId
	},
	variation: {}
});


var Wishlist = mongoose.model('Wishlist', WishlistSchema);

export default Wishlist;