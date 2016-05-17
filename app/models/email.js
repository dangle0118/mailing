'use strict';

/**
 * Module dependencies.
 */
 import mongoose from 'mongoose';
 var Schema = mongoose.Schema;

/**
 * Email Schema
 */
var EmailSchema = new Schema({
	recipient: {
		type: Schema.ObjectId,
	},
	message: String,
	date: {
		type: Date,
		default: Date.now(),
	},
	result: {},
});


var Email = mongoose.model('Email', EmailSchema);

export default Email;