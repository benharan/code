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
			"mouseover #QBS_2_inner>tbody>tr": "_all"
		},

        _markupScheme: {
			"trs": "#QBS_2_inner>tbody>tr"
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'rightContent', 'rightContent', true);
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

		_all: function (e) {
			const $target = $(e.currentTarget);
			$target.css('background', '#111');
			setTimeout(() => $target.css('background', 'none'), 500);
		}
    })
});
