/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "Toolset/toolset",
    "Modules/topBar/topBarView",
    "Modules/rightContent/rightContentView",
    "text!./mainFrame.html",
    "text!./mainFrame.css"
], function (_, $, Backbone, Displayable, Toolset, TopBarView, RightContentView, html, css) {
    return Displayable.extend({
        _topBar: null,
        _markupScheme: {
            "topBar": ".top-bar",
            "mainContent": ".main-content",
            "rightContent": ".right-content",
        },
        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
            this._topBar = new TopBarView();
            this._rightContent = new RightContentView();
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._dom.topBar.html(this._topBar.render());
            this._dom.rightContent.html(this._rightContent.render());
            return this.$el;
        },

        events: {
            "click .battleBoard_next": "_next"
        },

        setMainContent: function (content) {
            this._dom.mainContent.html(content)
        },

        _setRouting: function () {

        }
    })
});
