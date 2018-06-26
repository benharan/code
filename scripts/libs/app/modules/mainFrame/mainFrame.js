/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
	"EventBus",
	"Modules/TemplateManager/TemplateManager",
	"text!./scheme2.json",
    "./mainFrameView"
], function (_, $, Backbone, EventBus, TemplateManager, scheme2, View) {
    var scheme2Obj = JSON.parse(scheme2),
        view,
		getCacheParam = () => {
    		let result = '?v=';
    		if (0){ // No cache
				result += (new Date).getTime()
			} else if (0) { // One day
    			result += Math.floor((new Date).getTime() / (1000*60*60*24));
			}
			return result;
		}

    return Backbone.Model.extend({
        _sectionToModelMap: {
            'index': 'Modules/mainContent/mainContentView',
            'indices': {
				'model': 'Modules/indices/indicesView',
				'scheme': 'text!Schemes/indicesScheme.json'
			},
            'news': 'Modules/news/newsView',
            'portfolio': 'Modules/portfolios/portfolios',
            'equities': {
            	'model': 'Modules/equities/equitiesView',
				'scheme': 'text!Schemes/equitiesScheme.json'
			}
        },

        initialize: function () {
            view = new View();
			EventBus.on('CompileTemplates', this._renderToHeaders.bind(this, scheme2Obj))
        },

        render: function () {
            return view.render();
        },

        navigate: function (schemeNav, section, p1, p2) {
        	const modelPath = this._sectionToModelMap[section];

        	// Todo: DESTROY PREVIOUS!

			$(document).attr("title", section);
			if (schemeNav) {
				require([modelPath.model, modelPath.scheme + getCacheParam()], (ModelClass, Scheme) => {
					let schemeObj = JSON.parse(Scheme);
					this._renderTemplatesAndInject(schemeObj).then(cont => {
						view.setMainContent(cont);
						(new ModelClass(p1, p2)).render(p1, p2);
					})
				})
			} else {
				require([modelPath], function (ModelClass) {
					let modelInstance = new ModelClass(p1, p2),
						renderedView = modelInstance.render(p1, p2);

					view.setMainContent(renderedView);
					EventBus.trigger('mainFrameInsertion', renderedView);
					$(document).attr("title", section);
				})
			}
        },

		_renderTemplatesAndInject: function (schemeToRender) {
			return TemplateManager.render(schemeToRender); // Promise
		},

		_renderToHeaders: function (schemeToRender) {
            this._renderTemplatesAndInject(schemeToRender).then(cont => {
                view.$el.find('h1').eq(1).html(cont);
                view.$el.find('h2').html(cont);
            });
		}
    });
});
