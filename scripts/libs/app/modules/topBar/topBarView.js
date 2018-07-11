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
            "mouseover.lt #searchTextTop": "_al"
        },

        _markupScheme: {
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'topBar', 'topBar', true);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

		_al: function () {
			this.$el.off('mouseover.lt');
		}
    })
});
