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

        initialize: function (html, css) {
            this._markupTemplate = _.template(html || "");
            this._cssElement = $("<style/>").text(css || "");
        },

        render: function (templateData, scheme) {
            $("head").append(this._cssElement);

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
                if (!result[key].length) {
                    throwError('DOM Element Not Found', key, scheme[key]);
                }
            }

            this._dom = result;
        }
    })
});
