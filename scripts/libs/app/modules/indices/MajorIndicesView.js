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
    "Toolset/Toolset",
	"Modules/MultiselectList/MultiselectListView",
    "text!./Indices.css"
], function (_, $, Backbone, Displayable, TemplateManager, Tabs, Tab, Table, Toolset, MultiselectListView, css) {
	const _default_table = 'price',
		_table_name_to_scheme = {
			price: 'text!Schemes/MajorIndicesScheme.json',
			performance: 'text!Schemes/MajorIndicesPerfScheme.json'
		};

	/*
		Todo: !!!!!!
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
			"mainTable": "table.common-table",
			"tabsWrapper": ".button-tabs",
			"createNewViewPopup": ".custom-views"
		},

		initialize: function (currentTabName) {
            Displayable.prototype.initialize.call(this, '.main-container .container', css, true);
            this._currentTabName = currentTabName;
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._initTabs();
			this._initTables(this._currentTabName || _default_table);
			this._initMultilist();

			return this.$el;
		},

		_initMultilist: function () {
			this._msList = new MultiselectListView($('.custom-views'), {maxItems: 8});
			this._msList.render();
			this._msList.on('done', (list) => {
				lcl('Granted list is:', list);
				Toolset.Modal.exit();
			})
		},

		_initTabs: function () {
			this._mainTabs = new Tabs(Tab, { clip: true, $tabsWrapper: this._dom.tabsWrapper });
			// this._mainTabs.on('tabSelected', this._changeTable.bind(this));
			this._mainTabs.on('createNewView', this._openCreateView.bind(this));
			this._tableNameToCID = {};
			this._mainTabs.render(this.$el, true);
		},

		_addTable: function (tabName, $table) {
			let tableModel = this._tables.create($table);
			this._tableNameToCID[tabName] = tableModel.cid;
			return tableModel;
		},

		_initTables: function (currentTableName) {
			const TableCollection = Backbone.Collection.extend({ model: Table })
			this._tables = new TableCollection();
			this._currentTable = this._addTable(currentTableName, this._dom.mainTable);
			this._loadedTables = [ currentTableName ];
		},

		_changeTable: function (tabName) {
			this._currentTable.toggle(false);
			if (_.existsIn(this._loadedTables, tabName)) {
				this._currentTable = this._tables.get(this._tableNameToCID[tabName]).toggle(true);
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
		},

		_openCreateView: function () {
			Toolset.Modal.setup({
				title: 'Create New View',
				$content: this._dom.createNewViewPopup._show(),
				onExit: () => this._msList.reset(),
			});
		},
    })
});
