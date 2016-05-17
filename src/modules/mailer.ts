'use strict';


import * as _ from 'lodash';
import * as Q from 'q';
import * as Handlebars from 'handlebars';
import { EmailTemplate, IEmailTemplateModel } from '../models/email-template';
import { Email, IEmailModel } from '../models/email';
import { config } from '../config/config';

let	mailgun = require('mailgun-js')(config.mailgun);
var	emailVariables = require('./email-variables');

export default class Mailer {
    private templateName: string;
    private variableData: any;
    private recipient: any;
    private sender: any;
    private attachment: object;
    private filename: string;
	public template: IEmailTemplateModel;
	public templateData: any;
	public message: string;
	private _data: any;
	private result: any;

    constructor(templateName: string) {
        this.templateName = templateName;
        this.variableData = {};
    }

    public addTemplate(templateName: string): void {
        this.templateName = templateName;
    }

    public addRecipient(user: object): Mailer {
        this.recipient = user;
        return this;
    }

    public addSender(sender: any): Mailer {
        this.sender = {
            fromName: sender.firstName + ' ' + sender.lastName,
            fromEmail: sender.email
        };
        return this;
    }

    public addAttachment(attachment: any, filename: string): Mailer {
        this.attachment = attachment;
        this.filename = filename;
        return this;
    }

    public addData(data: object): Mailer {
        _.extend(this.variableData, data);
        return this;
    }

    private findTemplate(mailData: Mailer): Promise<Mailer> {
		return EmailTemplate.findOne({ name: mailData.templateName })
		.exec()
		.then((template) => {
			mailData.template = template;
			return mailData;
		})
		.catch((err) => {
			return new Error('Database error: unable to find template');
		});
    }

	private processData(mailData: Mailer): Promise<Mailer> {
		let deferred = Q.defer();
		mailData.templateData = {};

		_.forEach(mailData.template.variableGroups, (group) => {
			mailData.templateData[group] = {};
			_.forEach(emailVariables[group].fns, (fn, key) => {
				try {
					mailData.templateData[group][key] = fn(mailData.variableData[group]);
				}
				catch(e) {
					deferred.reject(new Error('Unable to resolve variable ' + group + '.' + key));
				}
			});
		});
		deferred.resolve(mailData);
		return deferred.promise;
	}

	private populateTemplate(mailData: Mailer): Promise<Mailer> {
		let deferred = Q.defer();
		mailData.message = Handlebars.compile(mailData.template.html)(mailData.templateData);
		mailData.template.subject = Handlebars.compile(mailData.template.subject)(mailData.templateData);
		deferred.resolve(mailData);
		return deferred.promise;
	}

	private mailGunSend(mailData: Mailer): Promise<any> {
		let deferred = Q.defer();
		let attachment = mailData.attachment ? new mailgun.Attachment({data: mailData.attachment, filename: mailData.filename}) : null;
		let sender = mailData.sender ? mailData.sender : config.email;
		mailData._data = {
			from: sender.fromName + ' <' + sender.fromEmail + '>',
			to: mailData.recipient.firstName + ' ' + mailData.recipient.lastName + ' <' + mailData.recipient.email + '>',
			subject: mailData.template.subject,
			html: mailData.message,
			attachment: attachment
		};

		if (process.env.NODE_ENV !== 'production') {
			mailData._data.subject += '(to ' + mailData._data.to + ')';
			mailData._data.to = 'Leflair Dev <email-test@leflair.vn>';
		}

		mailgun.messages().send(mailData._data, (err: any, body: any) => {
			console.log(mailData._data);
			if (err) {
				deferred.reject(err);
			}
			else {
				mailData.result = body;
				deferred.resolve(mailData);
			}
		});
		return deferred.promise;
	}

	private log(mailData: Mailer): Promise<IEmailModel> {
		var deferred = Q.defer();

		var email = new Email({
			recipient: mailData.recipient._id || null,
			message: mailData.message,
			result: mailData.result,
		});
		return email.save();

	}

	public send(): Promise<any> {
		return this.findTemplate(this)
			.then(this.processData)
			.then(this.populateTemplate)
			.then(this.mailGunSend)
			.then(this.log)
			.then((email: IEmailModel) => {
				console.log('Email sent to ' + email.recipient);
				return;
			})
			.catch((err) => {
				return err;
			});
	}
}