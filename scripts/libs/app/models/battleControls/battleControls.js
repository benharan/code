/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "../battleControls/battleControls"
], function (_, $, Backbone, Displayable, Utils, BattleControls) {
    return Displayable.extend({

        _markup: '<div class="battleBoard_wrapper"><h3>Battle:</h3><div class="battleBoard_enemyWrapper"></div></div>',

        initialize: function () {
            Displayable.prototype.initialize.call(this);
        },
        
        render: function () {
            Displayable.prototype.render.call(this);

        },

        loadEnemy: function (enemy) {
            enemy.render();
            this.$el.find(".battleBoard_enemyWrapper").html(enemy.$el);
        }
    })
});
