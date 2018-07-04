/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "./TabsView"
], function (_, $, Backbone, View) {
    return Backbone.Model.extend({

        _tabs: null, // Tab Collection

        initialize: function (TabConstructor, settings, prerendered) {
            const TabCollection = Backbone.Collection.extend({
				model: TabConstructor
			});
            this._tabs = new TabCollection();
            this._tabs.on('selected', this._onTabSelected.bind(this))
            this._view = new View(settings, prerendered);
        },

        render: function (tabName__$el, prerendered) {
			let $result;
        	if (prerendered) {
				$result = this._view.render(tabName__$el);

				_.e($result.find('li'), (tabElement, i) => {
					let $tab = $(tabElement);
					let tabObj = { name: $tab.text(), id: i, $tab };
					this.addTab(tabObj.name, tabObj).render();
				})
			} else {
				let $tabs = this._tabs.reduce($.elementAcc(TabModel => TabModel.render()), null);
				this._markAsSelected(tabName__$el);
				$result = this._view.render($tabs);
			}
			return $result;
        },

        addTab: function (tabName, tabSettings) {
			return this._tabs.create(tabName, tabSettings);
		},

		_onTabSelected: function (tabName) {
            this._markAsSelected(tabName);
            this.trigger('tabSelected', tabName);
            this._view.closeTabClipper();
		},

        _markAsSelected: function (tabName) {
            this._tabs.each(tab => {
                tab[tab.getName() !== tabName ? 'unselect' : 'select']();
			});
		}
    })
});
