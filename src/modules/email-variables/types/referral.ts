
import { config } from '../../../config/config';

export let fns = {
	referralLink: function(referral: any): string {
		return config.wwwHostName + '/signup/' + referral.code;
	}
};