/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable"
], function (_, $, Backbone, Displayable) {
	return Displayable.extend({

		_items: null,

		_markupScheme: {
			"input": ".search-box-input"
		},

		events: {
			"keyup .search-box-input": "_inputKeyUp"
		},

		initialize: function ($listWrapper, initialList) {
			Displayable.prototype.initialize.call(this, $listWrapper, '', true);
			this._items = initialList || [];
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			return this.$el;
		},

		loadList: function (list) {
			if (list.length) {
				_.e(list, item => this._items.push(item))
			} else {
				this._items = list;
			}
		},

		loadListFromDOM: function () {
			_.e(this.$el.find('li'), li => {
				this._items.push({
					textValue: $(li).text().toLowerCase(),
					$el: $(li)
				})
			})
		},

		_inputKeyUp: function () {
			const inputVal = this._dom.input.val().toLowerCase();
			_.e(this._items, item => {
				const isContained = ~item.textValue.indexOf(inputVal);
				item.$el._toggleShow(isContained || !inputVal);
			})
		}
	})
});
