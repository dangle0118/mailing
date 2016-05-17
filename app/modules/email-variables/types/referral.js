import { config } from '../../../../config/config';

export let fns = {
	referralLink: (referral) => {
		return config.wwwHostName + '/signup/' + referral.code;
	},
};
