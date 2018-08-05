/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Toolset/Toolset",
	"./TableView"
], function (_, $, Backbone, Toolset, View) {
	let TableClass = Backbone.ModelI.extend({
		_data: null,
		_view: null,
		_columns: null,
		_indexToColName: null,
		_stickyIndices: null,
		_sortState: { colIndex: -1, dir: 0 }, // 0 - None, 1 - Desc, 2 - Asc

		initialize: function ($table, settings) {
			this._initView($table);
			this._initColumns();
			this._loadDataFromDOM();

			if (settings.stickyIndices) {
				this._stickyIndices = settings.stickyIndices;
				this._view.colorRows(this._stickyIndices);
			}

			this._view.on('markRows', this._markRows.bind(this))
		},

		render: function () { },

		refresh: function () {
			this._view.render();
			this._loadDataFromDOM();
		},

		sort: function (colIndex) {
			let startTime = (new Date()).getTime();
			let newDir = this._getNewDir(colIndex),
				extractedStickies = _.extractByIndices(this._data, this._stickyIndices);

			this._data.sort(makeComparisonFunction(newDir, this._indexToColName[colIndex]));

			_.injectByIndices(this._data, this._stickyIndices, extractedStickies);
			this._view.reorder(_.pluck(this._data, 'originalIndex'), !newDir); // 0 is reset
			this._sortState = { colIndex, dir: newDir };
			this._view.setTHSortState(this._sortState);
			let sortEndTime = (new Date()).getTime();
			lcl(`Sort duration ${sortEndTime - startTime}ms`);
			requestAnimationFrame(()=>{
				lcl(`Rendering done after another ${(new Date()).getTime() - sortEndTime}ms`);
			})
		},

		toggle: function (flag) {
			this._view.toggle(flag);
			return this;
		},

		_initView: function (tableName, settings) {
			this._view = new View(tableName, settings.$table);
			this._view.on('thClick', this.sort.bind(this));
			this._view.render();
		},

		_loadDataFromDOM: function () {
			let value;
			this._data = [];

			for (value of this._view.generateTableIterator()) {
				if (_.isNu(value)) { // New Row
					this._data[value] = { originalIndex: value };
				} else { // TD
					let dataType = this._columns[value.colName].dataType;
					!Toolset.FinancialData.is(dataType, value.text) && announceWarn('Table Data parsing error, type mismatch', `'${value.text}' isn't ${dataType}`);
					this._data[value.rowIndex][value.colName] = Toolset.FinancialData.getValue(dataType, value.text);
				}
			}

			// Update view's _data?
			lcl('Table initialized. Data:', this._data);
		},

		_initColumns: function () {
			const { indexToColName, columns } = this._view.absorbColumns();
			this._columns = columns;
			this._indexToColName = indexToColName;
		},

		_getNewDir: function (colIndex) {
			return this._sortState.colIndex === colIndex ? ((this._sortState.dir + 1) % 3) : 1;
		},

		_markRows: function (rows) {
			lcl('Rows marked:', _.getByIndices(this._data, rows));
		}
	})

	function makeComparisonFunction(dir, colName) {
		return [
			(a, b) => a.originalIndex - b.originalIndex,
			(a, b) => b[colName] - a[colName],
			(a, b) => a[colName] - b[colName]
		][dir];
	}

	return TableClass;
});
