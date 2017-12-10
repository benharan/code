/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "../topBar/topBar",
    "text!../mainFrame/mainFrame.html",
    "text!../mainFrame/mainFrame.css"
], function (_, $, Backbone, Displayable, Utils, TopBar, html, css) {
    return Displayable.extend({

        _topBar: null,
        _markupScheme: {
            "topBar": ".top-bar"
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
            this._topBar = new TopBar();
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._dom.topBar.html(this._topBar.render());
            return this.$el;
        },

        events: {
            "click .battleBoard_next": "_next"
        }
    })
});
