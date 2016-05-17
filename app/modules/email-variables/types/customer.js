import mongoose from 'mongoose';
import { config } from '../../../../config/config';

export let fns = {
	fullName: (customer) => {
		return customer.firstName + ' ' + customer.lastName;
	},
	firstName: (customer) => {
		return customer.firstName;
	},
	passwordResetLink: (customer) => {
		return customer.resetPasswordToken ? config.wwwHostName + '/reset/' + customer.resetPasswordToken : '';
	},
};
