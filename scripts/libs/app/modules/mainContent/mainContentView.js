/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "EventBus",
    "Modules/Table/Table",
    "text!./mainContent.html",
    "text!./mainContent.css"
], function (_, $, Backbone, Displayable, EventBus, Table, html, css) {
    return Displayable.extend({

        _identifier: 'mainContentView',
        _mainTable: null,
        _markupScheme: { },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

			EventBus.onceAttachedToDOM(this.$el, this._initMainTable.bind(this), this);
			EventBus.on('append1k', this._append5k.bind(this, 1000))

            return this.$el;
        },

		_append5k: function (limit = 5000) {
			var i = 0, $tableTB = $('table[data-section="main-table"] tbody'),
				$lastTr = $tableTB.find('tr').last();

			while (i++ < limit) {
				$tableTB.append($lastTr.clone())
			}
			this._mainTable.refresh();
		},

        _initMainTable: function () {
            this._mainTable = new Table('$element?', { stickyIndices: [3] });
		}
    })
});
