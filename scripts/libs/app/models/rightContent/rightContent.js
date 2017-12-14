/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "text!../rightContent/rightContent.html",
    "text!../rightContent/rightContent.css"
], function (_, $, Backbone, Displayable, Utils, html, css) {
    return Displayable.extend({

        _markupScheme: {
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        }
    })
});
