import * as _ from 'lodash';
import q from 'q';
import handlebars from 'handlebars';
import Emailtemplate from '../models/email-template';
import Email from '../models/email';
import mailgunJs from 'mailgun-js';
import { config } from '../../config/config';
import emailVariables from './email-variables';

let mailgun = mailgunJs(config.mailgun);

function findTemplate(mailData) {
	let deferred = q.defer();
	Emailtemplate.findOne({ name: mailData.templateName })
	.exec((err, template) => {
		if (err) {
			console.error(err);
			deferred.reject(new Error('Database error: unable to find template'));
		}

		if (!template) {
			deferred.reject(new Error('Could not find a template with that name'));
		} else {
		// Wrap template in parent template
			mailData.template = template;
			deferred.resolve(mailData);
		}
	});

	return deferred.promise;
}

function processData(mailData) {
	let deferred = q.defer();
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

function populateTemplate(mailData) {
	var deferred = q.defer();

	mailData.message = handlebars.compile(mailData.template.html)(mailData.templateData);
	mailData.template.subject = handlebars.compile(mailData.template.subject)(mailData.templateData);

	deferred.resolve(mailData);

	return deferred.promise;
}

function mailGunSend(mailData) {
	console.log('debug: mailGunSend');
	var deferred = q.defer();

	mailData._data = {
		from: config.email.fromName + ' <' + config.email.fromEmail + '>',
		to: mailData.recipient.firstName + ' ' + mailData.recipient.lastName + ' <' + mailData.recipient.email + '>',
		subject: mailData.template.subject,
		html: mailData.message,
	};

	mailgun.messages().send(mailData._data, (err, body) => {
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

function log(mailData) {
	console.log('debug: log');
	var deferred = q.defer();

	var email = new Email({
		recipient: mailData.recipient._id || null,
		message: mailData.message,
		result: mailData.result,
	});

	email.save((err) => { 
		if (err) {
			deferred.reject(new Error('Unable to save email to emails log.'));
		} else {
			deferred.resolve(mailData);
		}
	});
	return deferred.promise;
}

export default class Mailer {
	constructor(templateName) {
		this.templateName = templateName;
		this.variableData = {};
	}

	addTemplate(templateName) {
		this.templateName = templateName;
	}

	addRecipient(user) {
		this.recipient = user;
		return this;
	}

	addData(data) {
		_.extend(this.variableData, data);
		return this;
	}	

	send() {
		var deferred = q.defer();

		findTemplate(this)
			.then(processData)
			.then(populateTemplate)
			.then(mailGunSend)
			.then(log)
			.then(function(mailData) {
				console.log('Email sent to ' + mailData.recipient.email);
				deferred.resolve();
			})
			.fail(function(err) {
				console.error(err);
				deferred.reject(err);
			});
		return deferred.promise;
	};
}
