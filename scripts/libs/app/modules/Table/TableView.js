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

		_markupScheme: {
			"tbody": "tbody",
			"trs": "tbody tr",
			"ths": "thead th"
		},
		_columns: null,
		_columnNames: null,
		_indexToColName: null,

		events: { },

		initialize: function (tableName) {
			Displayable.prototype.initialize.call(this, tableName, tableName, true);

			return this;
		},

		render: function () {
			Displayable.prototype.render.call(this, {}, this._markupScheme);

			return this.$el;
		},

		reorder: function (newOrder) {
			let $trs = this._dom.trs,
				$newSet = [];

			_.e(newOrder, index => $newSet.push($trs.eq(index)));

			$trs.detach(); // Used to retain bindings, try to avoid for faster rendering
			this._dom.tbody.html($newSet);
		},

		colorRows: function(rowsArr) {
			_.e(rowsArr, row => this._dom.trs.eq(row).css('background', '#439044'))
		},

		setTHSortState: function (newSortState) {
			this._dom.ths.find('i').remove();
			if (newSortState.dir) {
				this._dom.ths.eq(newSortState.colIndex).append($('<i/>').text(newSortState.dir === 1 ? 'V' : '/\\'));
			}
		},

		absorbColumns: function () {
			this._columns = {};
			this._indexToColName = [];
			_.e(this._dom.ths, (th, i) => {
				let $th = $(th),
					dataType = $th.data('type'),
					colName = $th.attr('col-name');

				if (dataType) {
					this._columns[colName] = { currentIndex: i, dataType };
					this._indexToColName[i] = colName;
					$th.on('click', (index => () => this.trigger('thClick', index))(i));
				}
			})
			return { indexToColName: this._indexToColName, columns: this._columns };
		},

		generateTableIterator: function* () {
			let i, j, $trs = this._dom.trs;

			for (i = 0; i < $trs.length; i++) {
				let $tds = $trs.eq(i).find('td');

				yield i; // Yield new row index

				for (j = 0; j < $tds.length; j++) {
					if (this._indexToColName[j]) {
						yield {
							rowIndex: i,
							colName: this._indexToColName[j],
							text: $tds.eq(j).text().trim()
						}
					}
				}
			}
		}
	})
});
