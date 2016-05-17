'use strict';

import * as user from './types/user';
import * as dateTime from './types/dateTime';
import * as customer from './types/customer';
// import * as order from './types/order';
import * as referral from './types/referral';



let emailVariables = {
	user: user,
	dateTime: dateTime,
	customer: customer,
	// order: order,
	referral: referral,
	_noValidate: ['dateTime'],

	configDefaults: {
		from: 'support@leflair.vn',
		fromName: 'Support'
	}
};

export default emailVariables;