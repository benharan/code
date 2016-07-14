/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "../battleControls/battleControls",
    "text!../battleBoard/battleBoard.html",
    "text!../battleBoard/battleBoard.css"
], function (_, $, Backbone, Displayable, Utils, BattleControls, html, css) {
    return Displayable.extend({

        _player: null,
        _battleControls: null,
        _markupScheme: { 
            "total": ".battleBoard_total", 
            "foeTotal": ".battleBoard_foeTotal", 
            "glt": ".battleBoard_glt", 
            "playerTotal": ".battleBoard_playerTotal" 
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
            
            this._battleControls = new BattleControls();

            this._battleControls.on("rolled", $.p(this._rollCallback, this));
        },
        
        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            this._battleControls.setStats({
                player_attack: this._player.getAttack(),
                player_name: this._player.getName()
            })
            
            this.$el.find(".battleBoard_battleControlsWrapper").html(this._battleControls.render());
            this.$el.find(".battleBoard_enemyWrapper").html(this._enemy.render());
        },
        
        setEnemy: function (enemy) {
            this._enemy = enemy;
            
            return this;
        },
        
        setPlayer: function (player) {
            this._player = player;

            return this;
        },

        _rollCallback: function (roll) {
            var foeAC = this._enemy.getStat("armorClass"),
                playerFullAttack = roll + this._player.getStat("attack"),
                subtraction = playerFullAttack - foeAC,
                result = subtraction/Math.abs(subtraction);

            this._dom.foeTotal.text(foeAC);
            this._dom.playerTotal.text(playerFullAttack);
            this._dom.glt.text(result > 0 ? "<" : (result < 0 ? ">" : "="));
        }
    })
});
