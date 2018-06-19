/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {
	var EventBus = Backbone.Model.extend({});
	return new EventBus();
});
