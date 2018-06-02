/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "Toolset/toolset",
    "text!./tab.html",
    "text!./tab.css"
], function (_, $, Backbone, Displayable, Toolset, html, css) {
    return Displayable.extend({
        _markupScheme: {

        },

		events: {
			'click': 'tabClick'
		},

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function (settings) {
            Displayable.prototype.render.call(this, settings, this._markupScheme);

            return this.$el;
        },

		tabClick: function () {
			this.trigger('selected');
		},

        select: function () {
			this.$el.addClass('selected');
        },

		unselect: function () {
			this.$el.removeClass('selected');
		}
    })
});
