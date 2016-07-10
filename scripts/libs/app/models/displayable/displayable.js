/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
    return Backbone.View.extend({

        _dom: null,
        _markupTemplate: null,

        initialize: function () {
            this._markupTemplate = _.template(this._markup);
        },

        render: function (templateData, scheme) {
            this.$el = $(this._markupTemplate(templateData || {}));

            this.delegateEvents();

            if (scheme) {
                this._cacheDom(scheme);
            }
            
            return this.$el;
        },
        
        _cacheDom: function (scheme) {
            var key, result = {};

            for (key in scheme) {
                result[key] = this.$el.find(scheme[key]);
            }

            this._dom = result;
        }
    })
});
