/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "Toolset/toolset",
    "text!./tabs.html",
    "text!./tabs.css"
], function (_, $, Backbone, Displayable, Toolset, html, css) {
    return Displayable.extend({
        _markupScheme: {
            wrapper: '.tabs-wrapper'
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
        },

        render: function ($tabs) {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._dom.wrapper.html($tabs);
            return this.$el;
        }
    })
});
