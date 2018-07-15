/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "Toolset/Toolset",
    "Modules/topBar/topBarView",
    "Modules/rightContent/rightContentView"
], function (_, $, Backbone, Displayable, Toolset, TopBarView, RightContentView) {
    return Displayable.extend({
        _topBar: null,
        _markupScheme: {
            "topBar": ".top-bar",
            "mainContent": ".main-content",
            "rightContent": ".right-content",
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'mainFrame', 'mainFrame', true);
            this._topBar = new TopBarView();
            this._rightContent = new RightContentView();
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._topBar.render();
            this._rightContent.render();
            return this.$el;
        },

        setMainContent: function (content) {
            this._dom.mainContent.html(content)
        }
    })
});
