import * as _ from 'lodash';

const MONGO_HOST = process.env.MONGO_HOST || 'localhost';
const MONGO_DB = process.env.MONGO_DB || 'mailing-leflair';

export let config = {
	app: {
		title: 'Leflair Vietnam - Mailing Service'
	},
	port: process.env.PORT || 3000,
	db: {
		uri: `mongodb://${MONGO_HOST}/${MONGO_DB}`,
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