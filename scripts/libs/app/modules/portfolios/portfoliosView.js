/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"text!./portfolios.html",
	"text!./portfolios.css"
], function (_, $, Backbone, Displayable, html, css) {
	return Displayable.extend({

		_markupScheme: {
			tabs: '.tabs-placeholder',
			portfolio: '.portfolio-placeholder'
		},

		initialize: function () {
			Displayable.prototype.initialize.call(this, html, css);

		},

		render: function (settings) {
			Displayable.prototype.render.call(this, settings, this._markupScheme);

			this._dom.tabs.html(settings.$tabs);
			this._dom.portfolio.html(settings.$portfolio);

			return this.$el;
		},

		loadPortfolio: function ($portfolio) {
			this._dom.portfolio.html($portfolio);
		}
	})
});
