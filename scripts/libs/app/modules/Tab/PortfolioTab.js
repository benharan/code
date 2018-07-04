/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"./Tab"
], function (_, $, Backbone, Tab) {
	return Tab.extend({

		initialize: function (tabName, tabSettings) {
			Tab.prototype.initialize.call(this, tabName, tabSettings);
		},

		render: function () {
			return Tab.prototype.render.call(this);
		}
	})
});
