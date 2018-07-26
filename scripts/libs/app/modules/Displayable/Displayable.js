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
		_rawCSS: null,
        _markupTemplate: null,

        initialize: function (html__$elem, css, prerendered) {
        	this._rawCSS = css;
            if (prerendered) { // Server rendered, wrap or seek in DOM
                this.$el = $(html__$elem);
				this.$el.isEmpty() && throwError('Section Wrapper not found', html__$elem);
            } else { // Normal fetching through require, render regularly
				this._setTemplate(html__$elem);
			}
			this._createStyleElem();
        },

        render: function (templateData, scheme) {
			this._render(templateData, scheme);

            return this.$el;
        },

		_setTemplate: function (html) {
        	if (html) {
				this._markupTemplate = _.template(html || "");
			}
		},

		_createStyleElem: function () {
			if (this._rawCSS) {
				this._cssElement = $("<style/>").text(this._rawCSS);
			}
		},

		injectCSS: function () {
			if (this._cssElement) {
				$head.append(this._cssElement);
			}
		},

		_render: function (templateData, scheme) {
			this.injectCSS();
			if (this._markupTemplate) {
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
            	let [, optional, cleanKey] = /^(\?)?(.*)$/.exec(key);
                result[cleanKey] = this.$el.find(scheme[key]);
                if (!result[cleanKey].length && !optional) {
                    throwError('Cache DOM (Markup Scheme) - Element Not Found', key, scheme[key]);
                }
            }

            this._dom = result;
        }
    })
});
