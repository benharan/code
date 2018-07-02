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
    "text!./tabs.html",
    "text!./tabs.css"
], function (_, $, Backbone, Displayable, TabScrollability, TabClipping, html, css) {
    return Displayable.extend({

        _settings: null,
        _tabClipper: null,

        _markupScheme: {
            ul: 'ul'
        },

        initialize: function (settings) {
            Displayable.prototype.initialize.call(this, html, css);
            this._settings = settings;
        },

        render: function ($tabs) {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            if (this._settings.scrollability) {
                new TabScrollability(this.$el);
                this.$el.addClass('scrollability');
            }

            if (this._settings.clip) {
                this._tabClipper = new TabClipping(this.$el);
                this.$el.addClass('clip');
            }

            this._dom.ul.html($tabs);

            return this.$el;
        },

        closeTabClipper: function () {
			this._tabClipper.closeDialog();
		}
    })
});
