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

        _markupScheme: { },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

			EventBus.onceAttachedToDOM(this.$el, () => {
                new Table('main-table', { stickyIndices: [0, 2, 3] });
            })

            return this.$el;
        }
    })
});
