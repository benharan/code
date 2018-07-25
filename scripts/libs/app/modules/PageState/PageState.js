/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {
	let PageState = Backbone.Model.extend({

		isPageInFocus: null,

		initialize: function (window, document) {
			this.window = window;
			this.document = document;
			this._analyse();
		},

		_analyse: function () {
			this._setPageInFocus(true);
			$(window).blur(this._setPageInFocus.bind(this, false));
			$(window).focus(this._setPageInFocus.bind(this, true));
		},

		_setPageInFocus: function (flag) {
			this.isPageInFocus = flag;
		},

	});
	return new PageState();
});
