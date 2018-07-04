/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
	"Modules/Tabs/Tabs",
	"Modules/Tab/Tab",
    "text!./Indices.css"
], function (_, $, Backbone, Displayable, Tabs, Tab, css) {
    return Displayable.extend({

		_mainTabs: null,
        _markupScheme: { },

        initialize: function () {
            Displayable.prototype.initialize.call(this, 'major-indices', css, true);

			this._mainTabs = new Tabs(Tab, { clip: true, scrollability: false }, true);
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            lcl(this.$el);
			this._mainTabs.render(this.$el, true);

            return this.$el;
        }
    })
});
