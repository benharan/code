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

        events: {
            "mouseover span": "_on",
            "mouseout span": "_off",
        },

        _markupScheme: {},

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'equities', 'equities', true);
        },

        render: function (instrument) {
            Displayable.prototype.render.call(this, instrument, this._markupScheme);

            return this.$el;
        },

        _on: function (e) {
            $(e.currentTarget).css('font-size', '20');
		},

        _off: function (e) {
            $(e.currentTarget).css('font-size', 'inherit');
		}
    })
});
