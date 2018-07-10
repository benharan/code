/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
	"Modules/Tabs/Tabs",
	"Modules/Tab/Tab",
	"Modules/Table/Table",
    "text!./Indices.css"
], function (_, $, Backbone, Displayable, Tabs, Tab, Table, css) {
    return Displayable.extend({

		_tables: null,
		_mainTabs: null,
		_loadedTables: null,
		_currentTable: null,
        _markupScheme: {
			"tableWrapper": ".table-wrapper"
		},

		initialize: function (currentTabName = 'price') {
            Displayable.prototype.initialize.call(this, 'major-indices', css, true);

			this._initTabs();
			this._initTables(currentTabName);
		},

		_initTabs: function () {
			this._mainTabs = new Tabs(Tab, {clip: true, scrollability: false}, true);
			this._mainTabs.on('tabSelected', this._changeTable.bind(this));
		},

		_addTable: function (tabName) {
			return this._tables.create(tabName)
		},

		_initTables: function (currentTableName) {
			const TableCollection = Backbone.Collection.extend({
				model: Table
			})
			this._tables = new TableCollection();
			this._currentTable = this._addTable(currentTableName);
			this._loadedTables = [currentTableName];
		},

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._mainTabs.render(this.$el, true);

            return this.$el;
        },

		_changeTable: function (tab) {
			this._currentTable.toggle(false);
			if (_.existsIn(this._loadedTables, tab)) {


			} else {
				/* Todo:
					Get Table scheme... (From server? Promise?)
					Render view

					Add table (new Table) on newly rendered table -> this._currentTable = this._addTable(tab);
				 */
			}

			// window.InvestingApp.Router.navigate(`/indices/major-indices/${tab}`, { trigger: false });
		}
    })
});
