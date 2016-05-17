import { Router } from 'express';
import { BaseRoute } from './base';
import * as MailingController from '../controllers/mailing';


export class MailingRoute extends BaseRoute {
    constructor() {
        super();
    }

    public create(router: Router): void {
        router.post(`${this.baseUrl}/return-request`, MailingController.createReturn);
    }

}