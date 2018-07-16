/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"Modules/SearchableList/SearchableListView"
], function (_, $, Backbone, Displayable, SearchableListView) {
	return Displayable.extend({

		_items: null,
		_sList: null,
		_maxItems: null,

		_markupScheme: {
			"selectedWrapper": ".selected-wrapper",
			"counter": ".multilist-counter"
		},

		events: {
			"click li": "_toggleItem"
		},

		initialize: function ($listWrapper, settings = {}) {
			Displayable.prototype.initialize.call(this, $listWrapper, '', true);
			this._items = {};

			this._sList = new SearchableListView($listWrapper.find('.list-wrapper'))
			this._sList.render();
			this._sList.loadListFromDOM();

			if (settings.maxItems) {
				this._maxItems = settings.maxItems;
			}
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._updateCount();
			
			return this.$el;
		},

		_toggleItem: function (e) {
			let $item = $(e.target),
				value = $item.data('value');

			if (!this._items[value]) {
				let $selectedItem = $('<div/>').text($item.text());
				$item.addClass('underline');
				this._dom.selectedWrapper.append($selectedItem);
				this._items[value] = { value, $selectedItem };
			} else { // Exists, remove
				$item.removeClass('underline');
				this._items[value].$selectedItem.remove();
				delete this._items[value];
			}
			lcl(this._items);
			this._updateCount();
		},

		_updateCount: function () {
			const count = _.size(this._items);
			this._dom.counter.text(`${count} items ` + (this._maxItems ? `of ${this._maxItems}` : ''))
		}
	})
});
