/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "text!../battleControls/battleControls.html",
    "text!../battleControls/battleControls.css"
], function (_, $, Backbone, Displayable, Utils, html, css) {
    return Displayable.extend({

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
            
        },
        
        render: function () {
            Displayable.prototype.render.call(this, this._stats, { "roll": ".battleControls_roll" });

            return this.$el;
        },

        events: {
            "click .battleControls_roll": "_rollClickCallback"
        },

        setStats: function (stats) {
            this._stats = stats;
        },

        resetRoller: function () {
            this._dom.roll
                .addClass("button")
                .text("Roll");
        },

        _rollClickCallback: function (e) {
            var roll;

            if (this._dom.roll.hasClass("button")) {
                roll = Utils.rand(20);

                this._dom.roll
                    .removeClass("button")
                    .text(roll);

                this.trigger("rolled", roll);
            }
        }
    })
});
