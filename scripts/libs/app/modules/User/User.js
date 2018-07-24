/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"EventBus",
	"Modules/Http/Http",
	"./UserView"
], function (_, $, Backbone, EventBus, Http, UserView) {
	let User = Backbone.Model.extend({
		initialize: function () {
			this._view = new UserView();
			this._view.render();

			EventBus.on('loginFromUI', this._openLogin.bind(this));
			this._view.on('submitLogin', this._login.bind(this));

			// this._openLogin();
		},

		_openLogin: function () {
			this._view.toggleLoginDialog(true);
		},

		_login: function () {
			Http.call('validate/creds/', {
				response: {
					success: 1,
					username: 'George',
					redirectURL: ''
				}
			}).then(respObj => {
				if (respObj.success) {
					lcl('Success');
					if (respObj.redirectURL) {
						window.location = respObj.redirectURL;
					} else {
						this._view.closeLogin();
						this._dynamicLogin(respObj);
					}
				} else {
					this._view.lockLoginButton(true);
					lcl('Fail');
				}
			})
		},

		_dynamicLogin: function ({ username }) {
			EventBus.trigger('login', username)
		}
	})

	return new User();
});
