import * as express from 'express';
import * as mongoose from 'mongoose';
import * as bodyParser from 'body-parser';
import * as methodOverride from'method-override';
import * as path from 'path';
import { Promise } from 'q';

import { MailingRoute } from '../routes/mailing';

export default class ExpressApp {
    public app: express.Application;

    constructor(db: mongoose.MongooseThenable) {
        this.app = express();

        this.config();

        this.routes();
    }

    private config(): void {
        this.app.set('showStackError', true);
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(bodyParser.json());
        this.app.use(methodOverride());

        global.Promise = Promise;
        (<any>mongoose).Promise = Promise;
    }

    private routes(): void {
        let router: express.Router = express.Router();
        new MailingRoute().create(router);

        this.app.use(router);
    }

    public listen(port: number): void {
        this.app.listen(port, () => {
            console.log(`Mailing Service started on port ${port}`);
        });
    }
}


