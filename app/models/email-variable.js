'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import timestamps from 'mongoose-timestamp';
var Schema = mongoose.Schema;

/**
 * Emailvariable Schema
 */
var EmailvariableSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill email variable name',
		trim: true
	},
	type: {
		type: String,
		enum: ['template', 'user', 'customer', 'order', 'referral'],
	},
	description: String,
	isArray: Boolean,
	nested: [{
		name: String,
		description: String,
	}],
	sample: {}
});

EmailvariableSchema.plugin(timestamps);

var Emailvariable = mongoose.model('Emailvariable', EmailvariableSchema);

export default Emailvariable;