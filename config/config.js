import * as _ from 'lodash';

export let config = {
	app: {
		title: 'Leflair Vietnam - Mailing Service'
	},
	port: process.env.PORT || 3000,
	db: {
		uri: 'mongodb://' + (process.env.MONGO_HOST || 'localhost') + '/mailing-leflair',
		options: {
			user: process.env.MONGO_USER,
			pass: process.env.MONGO_PASSWORD
		}
	},
	mailgun: {
		apiKey: process.env.MAILGUN_KEY || 'key-22b097892012bf449fd5fbb7bfc5c617',
		domain: process.env.MAILGUN_DOMAIN || 'sandbox2d1684e1142a4b8db51edaafd33ffead.mailgun.org',
	},
	mailChimp: {
		apiKey: process.env.MAILCHIMP_KEY,
		listId: '05d9d13b9d',
	}
};