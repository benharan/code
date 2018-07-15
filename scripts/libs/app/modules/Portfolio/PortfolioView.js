/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"text!./Portfolio.html",
	"text!./Portfolio.css"
], function (_, $, Backbone, Displayable, html, css) {
	return Displayable.extend({

		_markupScheme: {},

		initialize: function () {
			Displayable.prototype.initialize.call(this, html, css);

		},

		render: function (settings) {
			Displayable.prototype.render.call(this, settings, this._markupScheme);

			return this.$el;
		}
	})
});
