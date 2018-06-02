/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
    Backbone.ModelI = Backbone.Model.extend({});
	Backbone.ModelI.prototype.sync = function () { return null; }
	Backbone.ModelI.prototype.fetch = function () { return null; }
	Backbone.ModelI.prototype.save = function () { return null; }
});
