/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
	"Modules/EventBus/EventBus",
	"Modules/TemplateManager/TemplateManager",
	"text!./scheme2.json",
    "./mainFrameView"
], function (_, $, Backbone, EventBus, TemplateManager, scheme2, View) {
    var scheme = JSON.parse(scheme2),
        view;

    return Backbone.Model.extend({
        _sectionToModelMap: {
            'index': 'Modules/mainContent/mainContentView',
            'indices': 'Modules/indices/indicesView',
            'news': 'Modules/news/newsView',
            'portfolio': 'Modules/portfolios/portfolios',
        },

        initialize: function () {
            view = new View();
			EventBus.on('loadTitle', this._go)
        },
        render: function () {
            return view.render();
        },
        navigate: function (section, p1, p2) {
            if (this._sectionToModelMap[section]) {
				// Dynamically require needed model
				require([this._sectionToModelMap[section]], function (ModelClass) {
					var modelInstance = new ModelClass(p1, p2);
					view.setMainContent(modelInstance.render(p1, p2));
					$(document).attr("title", section);
				})
			}
        },

        _go: function () {
            TemplateManager.render(scheme).then(cont => {
                view.$el.find('h1').html(cont);
            });
		}
    });
});
