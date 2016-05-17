
export let fns = {
	time: () => {
		let date = new Date();
		return date.getHours() + ':' + date.getMinutes();
	},
	date: () => {
		let date = new Date();
		return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	},
};
