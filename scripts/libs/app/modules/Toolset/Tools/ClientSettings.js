/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"./ClientStorage"
], function (_, $, Backbone, ClientStorage) {
	return ClientStorage.extend({
		initialize: function () {
			ClientStorage.prototype.initialize.call(this, false, false);

			this._userId = window.serverData.uid;
		},

		setVal: function (key, value) {
			ClientStorage.prototype.setVal.call(this, this._userId + key, value);
		},

		getVal: function (key) {
			return ClientStorage.prototype.getVal.call(this, this._userId + key);
		}
	})
});
