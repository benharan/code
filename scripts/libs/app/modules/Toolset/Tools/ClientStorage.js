/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {

	return Backbone.Model.extend({

		initialize: function (useCompression, withPrints) {
			this._useCompression = useCompression;
			this._withPrints = withPrints;
		},

		setVal: function (key, value, warnIfExists) {
			let valueToSet = value;

			if (warnIfExists && !_.isNull(this.getVal(key))) {
				announceWarn('LocalStorage item already exists', key, this.getVal(key));
			}

			if (this._useCompression) {
				valueToSet = LZString.compress('' + value);
				this._withPrints && lcl(`Compression Stats\nBefore: ${value.length}\nAfter: ${valueToSet.length}\nRatio: ${+(valueToSet.length / value.length).toFixed(8)}`);
			}

			localStorage.setItem(key, valueToSet);
		},

		getVal: function (key) {
			let gotItem = localStorage.getItem(key);
			return this._useCompression ? LZString.decompress(gotItem) : gotItem;
		},

		clearVal: function (key) {
			localStorage.removeItem(key);
		},

		clearAll: function () {
			localStorage.clear();
		}
	});
});
