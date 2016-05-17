
import { config } from '../../../config/config';

export let fns = {
    fullName: function(customer: any): string {
		return customer.firstName + ' ' + customer.lastName;
	},
	firstName: function(customer: any): string {
		return customer.firstName;
	},
	passwordResetLink: function(customer: any): string {
		return customer.resetPasswordToken ? config.wwwHostName + '/reset/' + customer.resetPasswordToken : '';
	}
};