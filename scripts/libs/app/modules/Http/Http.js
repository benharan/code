/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {
	let noAjax = true,
		Http = Backbone.Model.extend({
		initialize: function () {

		},

		call: function (url, settings) {
			return new Promise((res, rej) => {
				if (noAjax) {
					setTimeout(() => {
						res(settings.response);
					}, Math.random() * 1000 * 1);
				} else {
					let callSettings = {
						url,
						type: 'POST',
						dataType: 'JSON',
						success: response => res(response)
					};
					// Todo: Add settings support
					$.ajax(callSettings)
				}
			})
		}

		// GET/POST aliases?
	})

	return new Http();
});
