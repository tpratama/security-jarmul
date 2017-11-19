new Vue({
	delimiters: ['<%', '%>'],
	el: '#homepage',
	data: {
		loginForm: true
	},
	methods: {
		registerBtnClick: function(e) {
			e.preventDefault();
			this.loginForm = false;
		}
	}
});