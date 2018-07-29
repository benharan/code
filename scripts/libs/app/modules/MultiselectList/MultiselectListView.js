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
			"selectedWrapper": ".custom-views-order ul",
			"selectedItemFirst": ".drop-comp-item",
			"selectedCounter": ".js-summary-counter-selected",
			"maxCounter": ".js-summary-counter-max",
			"itemCheckboxes": "li input[type=checkbox]",
			"items": "li",
			"resetButton": ".js-reset-button",
			"listTitle": ".custom-views-name .js-list-title "
		},

		events: {
			"click .js-reset-button": "reset"
		},

		initialize: function ($listWrapper, settings = {}) {
			Displayable.prototype.initialize.call(this, $listWrapper, '', true);
			this._items = {};

			this._initSearchableList($listWrapper);

			if (settings.maxItems) {
				this._maxItems = settings.maxItems;
			}
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._bindItems();
			this._updateCount();
			this._initSortability();
			this._dom.selectedItemFirst.detach();
			this.$el.f('.js-multilist-done').on('click', () => this.trigger('done', {
				title: this._dom.listTitle.text().trim(),
				list: this.getList()
			}))

			return this.$el;
		},

		getList: function () {
			let result = [];
			_.e(this._items, item => { // Realize order through indices
				result[item.$selectedItem.index()] = item.value;
			})
			return result;
		},

		reset: function () {
			this._dom.itemCheckboxes.uncheck().enable();
			this._dom.resetButton.disable();
			_.e(this._items, item => this._removeItem(item.value));
			this._sList.reset();
			this._updateCount();
			return this.$el;
		},

		_initSortability: function () {
			this._dom.selectedWrapper.sortable({ axis: 'y', items: 'li', cancel: '' });
		},

		_initSearchableList: function ($listWrapper) {
			this._sList = new SearchableListView($listWrapper.f('.custom-views-select'))
			this._sList.render();
			this._sList.loadListFromDOM();
		},

		_bindItems: function () {
			_.e(this._dom.items, li => {
				let $li = $(li);

				$li.f('input').on('change', () => {
					$li.toggleClass('underline', this._toggleValue($li.f('input').val()));
				});
			})
		},

		_removeItem: function (value) {
			this._items[value].$selectedItem.remove();
			delete this._items[value];
		},

		_toggleValue: function (value) {
			let newCount, result = !this._items[value]; // True if adding
			if (result) {
				let $selectedItem = this._dom.selectedItemFirst.clone();
				$selectedItem.f('.js-item-label').text(value);
				this._dom.selectedWrapper.append($selectedItem);
				this._items[value] = { value, $selectedItem };
			} else { // Exists, remove
				this._removeItem(value);
			}

			newCount = this._updateCount();

			if (newCount === this._maxItems) {
				this._dom.itemCheckboxes.filter(':not([checked])').disable();
			} else if (newCount === this._maxItems - 1) {
				this._dom.itemCheckboxes.enable();
			}

			this._dom.resetButton[newCount ? 'enable' : 'disable']();

			return result;
		},

		_updateCount: function () {
			const count = _.size(this._items);
			this._dom.selectedCounter.text(count)
			this._dom.maxCounter.text(this._maxItems);
			return count;
		},
	})
});
