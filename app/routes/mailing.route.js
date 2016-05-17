import * as Controller from '../controller';

export default function router(app) {

	app.route('/service/v1/wishlist/:userId')
		.get(Controller.getItems)
		.post(Controller.addItem);

	app.route('/service/v1/wishlist/:userId/existed')
		.get(Controller.itemExisted);
}
