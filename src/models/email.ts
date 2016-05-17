import { Schema, Document, Model, model } from 'mongoose';

export interface IEmail extends Document {
    recipient?: Schema.Types.ObjectId,
    message: string,
    date: Date,
    result: {}
}

export interface IEmailModel extends IEmail, Document {

}

let EmailSchema = new Schema({
    recipient: {
		type: Schema.Types.ObjectId,
	},
	message: String,
	date: {
		type: Date,
		default: Date.now(),
	},
	result: {},
});

export const Email: Model<IEmailModel> = model<IEmailModel>('Email', EmailSchema);