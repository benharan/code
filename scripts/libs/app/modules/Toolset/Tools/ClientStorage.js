/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {
	const useKeyCompression = 0;

	// Todo: Verify localStorage availability, fallback?
	return Backbone.Model.extend({

		initialize: function (useCompression, withPrints) {
			this._useCompression = useCompression;
			this._withPrints = withPrints;
		},

		setVal: function (key, value, warnIfExists) {
			let strValue = '' + value,
				valueToSet = strValue,
				keyToSet = '' + key;

			if (warnIfExists && !_.isNull(this.getVal(key))) {
				announceWarn('LocalStorage item already exists', key, this.getVal(key));
			}

			if (this._useCompression) {
				valueToSet = LZString.compress(strValue);
				this._withPrints && lcl(`Compression Stats\nBefore: ${strValue.length}\nAfter: ${valueToSet.length}\nRatio: ${+(valueToSet.length / strValue.length).toFixed(8)}`);
			}

			if (useKeyCompression) {
				keyToSet = LZString.compress(keyToSet);
			}

			localStorage.setItem(keyToSet, valueToSet);
		},

		getVal: function (key) {
			let gotItem = localStorage.getItem(useKeyCompression ? LZString.compress(key) : key);
			return this._useCompression ? LZString.decompress(gotItem) : gotItem;
		},

		clearVal: function (key) {
			localStorage.removeItem(key);
		},

		setObj: function (key, value, warnIfExists) {
			this.setVal(key, JSON.stringify(value), warnIfExists);
		},

		getObj: function (key) {
			return JSON.parse(this.getVal(key) || null);
		},

		clearAll: function () {
			localStorage.clear();
		}
	});
});
