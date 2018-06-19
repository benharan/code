/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
	"Modules/EventBus/EventBus",
    "text!./mainContent.html",
    "text!./mainContent.css"
], function (_, $, Backbone, Displayable, EventBus, html, css) {
    return Displayable.extend({

        _markupScheme: { },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

			this.$el.find('.big-news-image-homepage').on('click', e => {
                localStorage.clear('templates');
				EventBus.trigger('dropTemplates');
                cl('Templates Cleared');
                e.stopPropagation();
                e.preventDefault();
            })
            return this.$el;
        }
    })
});
