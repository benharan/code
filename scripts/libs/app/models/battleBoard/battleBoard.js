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
        _enemy: null,
        _enemies: null,
        _currentEnemyIndex: 0,
        _battleControls: null,
        _nextBehavior: null,
        _markupScheme: {
            "total": ".battleBoard_total",
            "foeTotal": ".battleBoard_foeTotal",
            "glt": ".battleBoard_glt",
            "playerTotal": ".battleBoard_playerTotal",
            "enemyWrap": ".battleBoard_enemyWrapper",
            "next": ".battleBoard_next"
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

            this._renderAndInjectEnemy();
        },

        events: {
            "click .battleBoard_next": "_next"
        },

        setEnemy: function (enemy) {
            if ($.isAr(enemy)) {
                this._enemies = enemy;
                this._enemy = enemy[this._currentEnemyIndex];
            } else {
                this._enemy = enemy;
            }

            return this;
        },

        setPlayer: function (player) {
            this._player = player;

            return this;
        },

        hideNext: function () {
            this._dom.next.hide();
        },

        _renderAndInjectEnemy: function () {
            this._dom.enemyWrap.html(this._enemy.render());
        },

        _next: function () {
            if ($.isSt(this._nextBehavior)){
                this.trigger(this._nextBehavior)
            } else if ($.isFu(this._nextBehavior)) {
                this._nextBehavior();
            } else {
                throw "Running next with no behavior planned";
            }
            this._nextBehavior = null;
        },

        _rollCallback: function (roll) {
            var foeAC = this._enemy.getStat("armorClass"),
                playerFullAttack = roll + this._player.getStat("attack"),
                subtraction = playerFullAttack - foeAC,
                result = subtraction / Math.abs(subtraction) + 1,
                glt = [">", "=", "<"];

            this._dom.foeTotal.text(foeAC);
            this._dom.playerTotal.text(playerFullAttack);
            this._dom.glt.text(glt[result]);

            switch (result) {
                case 0: // Fight Lost
                    this._nextBehavior = "battleLost";
                    break;
                case 1: // Fight Draw
                    this._nextBehavior = "battleDraw";
                    break;
                case 2: // Fight Won
                    this._player.XP((this._enemy.calculateXP(this._player.getStat("level"))));
                    if (this._currentEnemyIndex < this._enemies.length - 1) { // More Enemies
                        this._nextBehavior = function () {
                            this._enemy.remove();
                            this._enemy = this._enemies[++this._currentEnemyIndex];
                            this._renderAndInjectEnemy();
                            this._battleControls.resetRoller();
                            this._dom.foeTotal.text("");
                            this._dom.playerTotal.text("");
                            this._dom.glt.text("");
                        }
                    } else { // Battle Won
                        this._nextBehavior = "battleWon";
                    }
                    break;
            }
        }
    })
});
