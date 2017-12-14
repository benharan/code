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
    "../mainContent/mainContent",
    "../rightContent/rightContent",
    "text!../mainFrame/mainFrame.html",
    "text!../mainFrame/mainFrame.css"
], function (_, $, Backbone, Displayable, Utils, TopBar, MainContent, RightContent, html, css) {
    return Displayable.extend({

        _topBar: null,
        _markupScheme: {
            "topBar": ".top-bar",
            "mainContent": ".main-content",
            "rightContent": ".right-content",
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
            this._topBar = new TopBar();
            this._mainContent = new MainContent();
            this._rightContent = new RightContent();
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._dom.topBar.html(this._topBar.render());
            this._dom.mainContent.html(this._mainContent.render());
            this._dom.rightContent.html(this._rightContent.render());
            return this.$el;
        },

        events: {
            "click .battleBoard_next": "_next"
        },

        _setRouting: function () {

        }
    })
});
