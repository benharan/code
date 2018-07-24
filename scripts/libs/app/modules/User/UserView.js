/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"Toolset/Toolset",
	"text!./login.html"
], function (_, $, Backbone, Displayable, Toolset, loginMarkup) {
	/**
	 * Currently encompasses all of User model's views, which
	 * is just login. Consider later expanding to more views
	 */

	return Displayable.extend({

		events: {
			"click button.submit-login": "_submitLogin"
		},

		_markupScheme: {
			"loginUN": "input.username",
			"loginPS": "input.password",
			"loginButton": "button.submit-login",
			"loginErrors": ".error-container",
		},

		initialize: function () {
			Displayable.prototype.initialize.call(this, loginMarkup, '');

		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			return this.$el;
		},

		toggleLoginDialog: function(show) {
			if (show) {
				Toolset.Modal.setContent('Login', this.$el).show();
			} else {
				Toolset.Modal.hide();
			}
		},

		closeLogin: function () {
			this.toggleLoginDialog(false);
			this.lockLoginButton(true);
			this._clearForm();
		},

		lockLoginButton: function (unlock) {
			this._dom.loginButton.prop('disabled', !unlock);
		},

		_loginValid: function () {
			let result = [];

			if (!this._dom.loginUN.val()) {
				result.push('Username required');
			}
			if (!this._dom.loginPS.val()) {
				result.push('Password required');
			}

			return result;
		},

		_clearForm: function () {
			this._dom.loginUN.val('');
			this._dom.loginPS.val('');
		},

		_showErrors: function (validationResults) {
			this._dom.loginErrors.html(validationResults.join('<br/>'))
		},

		_submitLogin: function () {
			let validationResults = this._loginValid();
			if (_.isE(validationResults)) {
				this.lockLoginButton();
				this.trigger('submitLogin');
			} else {
				this._showErrors(validationResults);
			}
		}
	})
});
