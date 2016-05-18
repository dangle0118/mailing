import Mailer from './modules/email';

export function send(req, res) {
	let mail = req.body;

	new Mailer(mail.type)
		.addRecipient(mail.recipient)
		.addData(mail.data)
		.send()
		.then(() => {
			return res.json({ message: 'Email sent successfully' });
		}, (err) => {
			console.error('Error sending: ', err);
			return res.status(400).json({ message: 'Unable to send email' });
		});
}
