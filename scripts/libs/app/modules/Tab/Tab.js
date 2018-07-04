/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"./TabView"
], function (_, $, Backbone, View) {
	return Backbone.ModelI.extend({

		isSelected: false,

		initialize: function (tabName, tabSettings) {
			this._settings = tabSettings;
			this._$prerenderedTab = tabSettings.$tab;
			this._view = new View(this._$prerenderedTab);
			this._view.on('selected', () => {
				if (!this.isSelected || tabSettings.alwaysTrigger) {
					this.trigger('selected', tabName, tabSettings);
				}
			});
		},

		render: function () {
			if (this._$prerenderedTab) {
				this._view.render();
			} else {
				return this._view.render({
					label: this._settings.name
				});
			}
		},

		getName: function () {
			return this._settings.name;
		},

		select: function () {
			this.isSelected = true;
			this._view.select();
		},

		unselect: function () {
			this.isSelected = false;
			this._view.unselect();
		}
	})
});
