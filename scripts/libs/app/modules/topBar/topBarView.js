/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "Modules/EventBus/EventBus",
    "text!./topBar.html",
    "text!./topBar.css"
], function (_, $, Backbone, Displayable, EventBus, html, css) {
    return Displayable.extend({

        events: {
            "click #searchTextTop": "_loadTitle"
        },

        _markupScheme: {
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

        _loadTitle: function () {
			EventBus.trigger('loadTitle');
		}
    })
});
