/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {
	let Http = Backbone.Model.extend({
		initialize: function () {

		},

		call: function (url, settings) {
			return new Promise((res, rej) => {
				$.ajax({
					url,
					type: 'POST',
					...settings,
					success: response => res(response)
				})
			})
		}

		// GET/POST aliases?
	})

	return new Http();
});
