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
        _sectionToModelMap: {
            'index': './app/models/mainContent/mainContent',
            'indices': './app/models/indices/indices',
            'news': './app/models/news/news'
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
            //this._setMainContent(this._mainContent.render());
            this._dom.rightContent.html(this._rightContent.render());
            return this.$el;
        },

        navigateTo: function (section, p1, p2) {
            var setMainCont = this._setMainContent.bind(this);

            // Dynamically require needed model
            require([this._sectionToModelMap[section]], function (ModelClass) {
                var modelInstance = new ModelClass();
                setMainCont(modelInstance.render(p1, p2));
                $(document).attr("title", section);
            })
        },

        events: {
            "click .battleBoard_next": "_next"
        },

        _setMainContent: function (content) {
            this._dom.mainContent.html(content)
        },

        _setRouting: function () {

        }
    })
});
