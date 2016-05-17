export const config = {
    app: {
        title: 'Leflair Vietnam - Mailing Service'
    },
    hostName: process.env.HOSTNAME || 'http://admin.leflair.dev:3000',
	wwwHostName: process.env.WWW_HOSTNAME || 'http://www.leflair.dev:3000',
    port: process.env.PORT || 3600,
    db: {
        uri: `mongodb://${process.env.MONGO_HOST || 'localhost'}/admin-leflair`,
        options: {
            user: process.env.MONGO_USER,
			pass: process.env.MONGO_PASSWORD
        }
    },
    mailgun: {
		apiKey: 'key-22b097892012bf449fd5fbb7bfc5c617',
		domain: 'sandbox2d1684e1142a4b8db51edaafd33ffead.mailgun.org',
	},
    email: {
		fromName: 'Leflair',
		fromEmail: 'info@leflair.vn'
	},
    ghnContact: {
        firstName: 'Trang',
		lastName: '',
		email: 'email-test@leflair.vn'
    },
    leflairReturnContact: {
        email: 'returns-tracking@leflair.vn',
		firstName: 'Tracking',
		lastName: 'Leflair'
    }
};

