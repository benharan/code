/**
 * Created by Skeksify on 09/07/2016.
 */

/*
	Table markup API

	Optional:
		Data to process:
			Column th need to state data-type="%type%" (price, percent...) and col-name="%colName%"
			Columns without data types aren't handled
		Mark:
			One thead>th need to exist with col-name="mark"
			Each row, in that column index need to contain an input type="checkbox"

 */

define([
	"underscore",
	"jquery",
	"Backbone",
	"Displayable",
	"External/table-dragger"
], function (_, $, Backbone, Displayable, TableDragger) {
	return Displayable.extend({

		_markupScheme: {
			"tbody": "tbody",
			"ths": "thead th",
			"trs": "tbody tr"
		},

		/* Likely best to avoid keeping reference collections per row
		Perhaps keep refs and from a certain row count go dynamic */

		_columns: null,
		_indexToColName: null,
		_markColumnIndex: null,
		_markedRows: null,
		_lastMarkedRowIndex: null,
		_currentOrder: null,

		events: { },

		initialize: function ($table) {
			Displayable.prototype.initialize.call(this, $table, null, true);

			this._markedRows = {};
			return this;
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			this._initializeDraggability();

			return this.$el;
		},

		reorder: function (newOrder, isReset) {
			let $trs = this._dom.trs,
				$newSet = [];

			this._currentOrder = newOrder;
			_.e(newOrder, index => $newSet.push($trs.eq(index)[0]));

			$trs.detach(); // Used to retain bindings, try to avoid for faster rendering
			this._dom.tbody.html($newSet);
			this._lastMarkedRowIndex = null;
			if (isReset) {
				this._currentOrder = null;
			}
		},

		colorRows: function(rowsArr) {
			_.e(rowsArr, row => this._dom.trs.eq(row).addClass('sticky'));
		},

		setTHSortState: function (newSortState) {
			this._dom.ths.find('i').remove();
			if (newSortState.dir) {
				this._dom.ths.eq(newSortState.colIndex).append($('<i/>').text(newSortState.dir === 1 ? '\\/' : '/\\'));
			}
		},

		absorbColumns: function () {
			this._columns = {};
			this._indexToColName = [];
			_.e(this._dom.ths, (th, i) => {
				let $th = $(th),
					dataType = $th.data('type'),
					colName = $th.attr('col-name') || '';

				if (dataType) {
					this._columns[colName] = { currentIndex: i, dataType };
					this._indexToColName[i] = colName;
					$th.on('click', (index => () => this.trigger('thClick', index))(i));
				}

				if (colName.is('mark')) {
					this._markColumnIndex = i;
				}
			})
			return {
				indexToColName: _.extend({}, this._indexToColName), // Later mutated in view
				columns: this._columns
			};
		},

		generateTableIterator: function* () {
			let i, j, $trs = this._dom.trs;

			for (i = 0; i < $trs.length; i++) {
				let $tr = $trs.eq(i),
					$tds = $tr.find('td');

				yield i; // Yield new row index

				for (j = 0; j < $tds.length; j++) {
					let $td = $tds.eq(j);
					if (this._markColumnIndex === j) {
						$td.find('input').on('click', this._markRow.bind(this, i)); // Change doesn't dispatch shiftKey
					} else if (this._indexToColName[j]) { // Was initialized
						yield {
							rowIndex: i,
							colName: this._indexToColName[j],
							text: $td.text().trim()
						}
					}
				}
			}
		},

		toggle: function (flag) {
			this.$el._toggleShow(flag);
		},

		_initializeDraggability: function () {
			this._tableDragger = TableDragger(this.$el[0], {
				mode: 'column',
				dragHandler: '.drag-handle'
			})

			this._tableDragger.on('drop', (old, newI) => {
				_.swap(this._indexToColName, old, newI);
			});
		},

		_currentToOriginalIndex: function (rowIndex) {
			return this._currentOrder ? this._currentOrder[rowIndex] : rowIndex;
		},

		_markRow: function (originalIndex, e) {
			let $tr = this._dom.trs.eq(originalIndex),
				currentIndex = $tr.index(); // Original to current

			if (this._markedRows[originalIndex]) { // Unmark
				this._lastMarkedRowIndex = null;
				delete this._markedRows[originalIndex];
				$tr.removeClass('marked');
			} else if (e.shiftKey && _.isNu(this._lastMarkedRowIndex)) { // Bulk mark
				_.e(this._getMarkedRange(this._lastMarkedRowIndex, currentIndex), (rowIndex) => {
					this._addToMarked(rowIndex, true);
				});
			} else { // Mark
				this._addToMarked(currentIndex);
			}
			this.trigger('markRows', _.keys(this._markedRows));
		},

		_addToMarked: function (currentRowIndex, markCheckbox) {
			const originalIndex = this._currentToOriginalIndex(currentRowIndex);
			this._lastMarkedRowIndex = currentRowIndex;
			this._markedRows[originalIndex] = true;
			this._dom.trs.eq(originalIndex).addClass('marked');
			if (markCheckbox) {
				this._dom.trs.eq(originalIndex).find('td.col-mark input').prop('checked', true);
			}
		},

		_getMarkedRange: function (oneEnd, secondEnd) {
			let i, result = [],
				start, end;

			if (oneEnd < secondEnd) { // Top to bottom
				start = oneEnd + 1;
				end = secondEnd;
			} else {
				start = secondEnd;
				end = oneEnd - 1;
			}
			for (i = start; i <= end; i++) {
				!this._markedRows[this._currentToOriginalIndex(i)] && result.push(i);
			}
			return result;
		}
	})
});
