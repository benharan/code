/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
	"Modules/TabScrollability/TabScrollability",
	"Modules/TabClipping/TabClipping",
    "text!./Tabs.html",
    "text!./Tabs.css"
], function (_, $, Backbone, Displayable, TabScrollability, TabClipping, html, css) {
    return Displayable.extend({

        _settings: null,
        _tabClipper: null,

        _markupScheme: {
            ul: 'ul'
        },

        initialize: function (settings, prerendered) {
			if (prerendered) {
				Displayable.prototype.initialize.call(this, 'tabs-wrapper', css, true);
				this._prerendered = true;
			} else {
				Displayable.prototype.initialize.call(this, html, css);
			}
            this._settings = settings;
        },

        render: function ($tabs) {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

			if (!this._prerendered) {
				this._dom.ul.html($tabs);
			}

            if (this._settings.scrollability) {
				this._initializeTabScrollability();
			} else if (this._settings.clip) {
				this._initializeTabClipping();
			}

            return this.$el;
        },

		_initializeTabClipping: function () {
			if (this._prerendered) {
				this._tabClipper = new TabClipping(this.$el, true);
			} else { // Sending undefined var changes to {}
				this._tabClipper = new TabClipping(this.$el);
			}
			this.$el.addClass('clip');
		},

		_initializeTabScrollability: function () {
			new TabScrollability(this.$el);
			this.$el.addClass('scrollability');
		},

        closeTabClipper: function () {
			this._tabClipper && this._tabClipper.closeDialog();
		}
    })
});
