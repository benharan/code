/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "./tabsView"
], function (_, $, Backbone, View) {
    return Backbone.Model.extend({

        _tabs: null, // Tab Collection

        initialize: function (TabConstructor, settings) {
            const TabCollection = Backbone.Collection.extend({
				model: TabConstructor
			});
            this._tabs = new TabCollection();
            this._tabs.on('selected', this._onTabSelected.bind(this))
            this._view = new View(settings);
        },

        render: function (tabName) {
			let $tabs = this._tabs.reduce($.elementAcc(view => view.render()), null);
			this._markAsSelected(tabName);
            return this._view.render($tabs);
        },

        addTab: function (tabName, tabSettings) {
            this._tabs.create(tabName, tabSettings);
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
