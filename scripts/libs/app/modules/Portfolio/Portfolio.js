/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
	"./PortfolioView"
], function (_, $, Backbone, View) {
	return Backbone.ModelI.extend({

		initialize: function (name) {
			this._settings = { name };
			this._view = new View();
		},

		render: function () {
			return this._view.render(this._settings);
		},

		getName: function () {
			return this._settings.name;
		}
	})
});
