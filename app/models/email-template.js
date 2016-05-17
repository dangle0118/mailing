'use strict';

/**
 * Module dependencies.
 */
 import mongoose from 'mongoose';
 import timestamps from 'mongoose-timestamp';
	// validator = require('../modules/validator'),

 var Schema = mongoose.Schema;

/**
 * Emailtemplate Schema
 */
var EmailtemplateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Email name',
		trim: true,
		unique: true,
	},
	site: {
		type: String,
		enum: ['Admin', 'www'],
	},
	category: {
		type: String,
		enum: ['Template', 'Account', 'Order'],
	},
	variableGroups: [{
		type: String,
		enum: ['template', 'user', 'customer', 'order'],
	}],
	html: String,
	subject: String,
},
{
	toObject: {virtuals: true},
	toJSON: { virtuals: true},
});

EmailtemplateSchema.virtual('_valid').get(() => {
	return validator(this, ['name', 'site', 'category', 'variableGroups', 'html', 'subject']);
});

EmailtemplateSchema.plugin(timestamps);

var Emailtemplate = mongoose.model('Emailtemplate', EmailtemplateSchema);

export default Emailtemplate;