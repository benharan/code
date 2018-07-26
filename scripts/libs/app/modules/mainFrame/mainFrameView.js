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
], function (_, $, Backbone, Displayable, Toolset, TopBarView) {
    return Displayable.extend({

        _topBar: null,
        _markupScheme: {
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, '.main-container', 'mainFrame', true);
            this._topBar = new TopBarView();
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);
            this._topBar.render();
            return this.$el;
        },

        setMainContent: function (content) {
            this.$el.html(content)
        }
    })
});
