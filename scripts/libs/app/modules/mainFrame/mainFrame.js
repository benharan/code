/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "./mainFrameView"
], function (_, $, Backbone, View) {
    var view;
    return Backbone.Model.extend({
        _sectionToModelMap: {
            'index': 'Modules/mainContent/mainContentView',
            'indices': 'Modules/indices/indicesView',
            'news': 'Modules/news/newsView'
        },

        initialize: function () {
            view = new View();
        },
        render: function () {
            return view.render();
        },
        navigate: function (section, p1, p2) {
            // Dynamically require needed model
            require([this._sectionToModelMap[section]], function (ModelClass) {
                var modelInstance = new ModelClass();
                view.setMainContent(modelInstance.render(p1, p2));
                $(document).attr("title", section);
            })
        },
    });
});
