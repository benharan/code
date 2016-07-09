/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "utils"
], function (_, $, Backbone, Utils) {
    return Backbone.Model.extend({

        _dom: null,
        _markupTemplate: null,

        initialize: function () {
            this._markupTemplate = _.template(this._markup);
        },

        render: function (templateData) {
            this.$el = $(this._markupTemplate(templateData || {}));
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
