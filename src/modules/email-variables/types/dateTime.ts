
export let fns = {
    time: function(): string {
		let date = new Date();
		return date.getHours() + ':' + date.getMinutes();
	},
	date: function(): string {
		var date = new Date();
		return date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
	}
};