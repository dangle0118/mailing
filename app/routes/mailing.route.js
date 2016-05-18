import * as Controller from '../controller';

export default function router(app) {

	app.route('/service/v1/mailing/send')
		.post(Controller.send);
}
