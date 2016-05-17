import { Schema, Document, Model, model } from 'mongoose';

export interface IEmailTemplate extends Document {
	name: string,
	site: string,
	category: string,
	variableGroups: Array<string>,
	html: string,
	subject: string
}

export interface IEmailTemplateModel extends IEmailTemplate, Document {

}

let EmailTemplateSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Email name',
		trim: true,
		unique: true
	},
	site: {
		type: String,
		enum:['Template', 'Account', 'Order']
	},
	variableGroups: [{
		type: String,
		enum: ['template', 'user', 'customer', 'order']
	}],
	html: String,
	subject: String
}, {
	toObject: { virtuals: true },
	toJSON: { virtual: true }
});

export const EmailTemplate: Model<IEmailTemplateModel> = model<IEmailTemplateModel>('EmailTemplate', EmailTemplateSchema);