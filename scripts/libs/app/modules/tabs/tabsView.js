/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
	"Modules/TabScrollability/TabScrollability",
    "text!./tabs.html",
    "text!./tabs.css"
], function (_, $, Backbone, Displayable, TabScrollability, html, css) {
    return Displayable.extend({
        _markupScheme: {
            ul: 'ul'
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
        },

        render: function ($tabs) {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._dom.ul.html($tabs);
            new TabScrollability(this.$el);
            return this.$el;
        }
    })
});
