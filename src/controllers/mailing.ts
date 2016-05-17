import { NextFunction, Request, Response, Router } from 'express';
import Mailer from '../modules/mailer';
import { config } from '../config/config';




export function createReturn(req: Request, res: Response) {
    let order = req.body.order;

    new Mailer('GHN Return Request')
    .addRecipient(config.ghnContact)
    .addSender(config.leflairReturnContact)
    .addData({
        order: order
    })
    .send();

    return res.json({ status: true });
}