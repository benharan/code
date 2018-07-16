/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "TemplateManager",
	"Modules/Tabs/Tabs",
	"Modules/Tab/Tab",
	"Modules/Table/Table",
	"Modules/SearchableList/SearchableListView",
    "text!./Indices.css"
], function (_, $, Backbone, Displayable, TemplateManager, Tabs, Tab, Table, SearchableList, css) {
	const _default_table = 'price',
		_table_name_to_scheme = {
			price: 'text!Schemes/MajorIndicesScheme.json',
			performance: 'text!Schemes/MajorIndicesPerfScheme.json'
		};

	/*
		Todo:
		Extract Tabs+Tables as a module
		Enhance Collections to support stringy id lookup
	 */

    return Displayable.extend({

		_tables: null,
		_mainTabs: null,
		_loadedTables: null,
		_tableNameToCID: null,
		_currentTable: null,
        _markupScheme: {
			"tableWrapper": ".table-wrapper"
		},

		initialize: function (currentTabName) {
            Displayable.prototype.initialize.call(this, 'major-indices', css, true);
            this._currentTabName = currentTabName;
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._initTabs();
			this._initTables(this._currentTabName || _default_table);
			this._sList = new SearchableList($('.list-wrapper'))
			this._sList.render();
			this._sList.loadListFromDOM();

			return this.$el;
		},

		_initTabs: function () {
			this._mainTabs = new Tabs(Tab, {clip: true, scrollability: false}, true);
			this._mainTabs.on('tabSelected', this._changeTable.bind(this));
			this._tableNameToCID = {};
			this._mainTabs.render(this.$el, true);
		},

		_addTable: function (tabName, $table) {
			let tableModel = this._tables.create(tabName, { $table });
			this._tableNameToCID[tabName] = tableModel.cid;
			return tableModel;
		},

		_initTables: function (currentTableName) {
			const TableCollection = Backbone.Collection.extend({
				model: Table
			})
			this._tables = new TableCollection();
			this._currentTable = this._addTable(currentTableName, this._dom.tableWrapper.find('table'));
			this._loadedTables = [ currentTableName ];
		},

		_changeTable: function (tabName) {
			this._currentTable.toggle(false);
			if (_.existsIn(this._loadedTables, tabName)) {
				this._currentTable = this._tables.get(this._tableNameToCID[tabName]);
				this._currentTable.toggle(true);
			} else {
				require([_table_name_to_scheme[tabName]], (scheme) => {
					let schemeObj = JSON.parse(scheme);
					TemplateManager.render(schemeObj).then(renderedView => {
						let $table = $(renderedView);
						this._dom.tableWrapper.append($table);
						this._currentTable = this._addTable(tabName, $table);
						this._loadedTables.push(tabName);
					})
				})

				// window.InvestingApp.Router.navigate(`/indices/major-indices-${tab}`, { trigger: false });
			}
		}
    })
});
