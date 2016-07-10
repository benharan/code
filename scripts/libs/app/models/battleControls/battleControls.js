/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils"
], function (_, $, Backbone, Displayable, Utils) {
    return Displayable.extend({

        _markup: '<div class="battleControls_wrapper"><h3><%=player_name%></h3>' +
        '<div class="wrapper">Attack: <div class="battleControls_attack"><%=player_attack %></div> </div>' +
        '<div class="wrapper">Attack Bonus: <div class="battleControls_roll button">Roll</div> </div>' +
        '</div>',

        initialize: function () {
            Displayable.prototype.initialize.call(this);
            
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

        _rollClickCallback: function (e) {
            var roll = Utils.rand(20);

            this._dom.roll.text(roll);

            this.trigger("rolled", roll);
        }
    })
});
