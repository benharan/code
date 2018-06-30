/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
	let $head = $('head');

    return Backbone.View.extend({

        _dom: null,
        _markupTemplate: null,

        initialize: function (html, css, arePaths) {
            if (arePaths) { // Server rendered, seek in DOM
                this.$el = $(`body [data-section="${html}"]`);
				this.$el.isEmpty() && throwError('Section Wrapper not found', html);
            } else { // Normal fetching through require, render regularly
				this._setTemplate(html, css);
			}
        },

        render: function (templateData, scheme) {
			this._render(templateData, scheme);

            return this.$el;
        },

		_setTemplate: function (html, css) {
			this._markupTemplate = _.template(html || "");
			if (css) {
				this._cssElement = $("<style/>").text(css);
			}
		},

		_render: function (templateData, scheme) {
			if (this._markupTemplate) {
				if (this._cssElement) {
					$head.append(this._cssElement);
				}
                this.$el = $(this._markupTemplate(templateData || {}));
            }
			this.delegateEvents(); // Rebind according to 'events'
			if (scheme) {
				this._cacheDom(scheme);
			}
		},

        _cacheDom: function (scheme) {
            var key, result = {};

            for (key in scheme) {
                result[key] = this.$el.find(scheme[key]);
                if (!result[key].length) {
                    throwError('cacheDOM - Element Not Found', key, scheme[key]);
                }
            }

            this._dom = result;
        }
    })
});
