
export let fns = {
	fullName: function(user: any): string {
		return user.firstName + ' ' + user.lastName;
	},
	firstName: function(user: any): string {
		return user.firstName;
	},
};