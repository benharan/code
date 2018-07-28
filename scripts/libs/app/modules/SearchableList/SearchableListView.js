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
			"input": "input[type=\"search\"]"
		},

		events: {
			"keyup input[type=\"search\"]": "_applySearch",
		},

		initialize: function ($listWrapper, initialList) {
			Displayable.prototype.initialize.call(this, $listWrapper, '', true);
			this._items = initialList || [];
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._dom.input.on('search', () => this._applySearch());
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
			_.e(this.$el.f('li'), li => {
				this._items.push({
					textValue: $(li).text().trim().toLowerCase(),
					$el: $(li)
				})
			})
		},

		reset: function () {
			this._dom.input.val('');
			_.e(this._items, item => item.$el._show());
		},

		_applySearch: function () {
			const inputVal = this._dom.input.val().toLowerCase();
			_.e(this._items, item => {
				const isContained = ~item.textValue.indexOf(inputVal);
				item.$el._toggleShow(isContained || !inputVal);
			})
		},
	})
});
