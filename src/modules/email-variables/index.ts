
module.exports = {
	user: require('./types/user'),
	dateTime: require('./types/dateTime'),
	customer: require('./types/customer'),
	order: require('./types/order'),
	referral: require('./types/referral'),

	_noValidate: ['dateTime'],

	configDefaults: {
		from: 'support@leflair.vn',
		fromName: 'Support',
	}
};