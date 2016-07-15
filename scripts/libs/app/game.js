/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "./models/battleBoard/battleBoard",
    "./models/player/player",
    "./models/enemy/enemy"
], function (_, $, Backbone, BattleBoard, Player, Enemy) {
    var game = Backbone.Model.extend({
        
        _player: null,
        _currentEnemy: null,
        _battleBoard: null,

        start: function () {
            this._currentEnemy = new Enemy("goblin");

            this._player = new Player();
            this._player.setStats({
                _name: "Rhorgar",
                _attack: 1,
                _armorClass: 10,
                _damage: "1d3",
                _level: 1
            })

            this._battleBoard = new BattleBoard();
            this._battleBoard
                .on({
                    "battleLost": $.p(this._battleLost, this),
                    "battleDraw": $.p(this._battleDraw, this),
                    "battleWon": $.p(this._battleWon, this)
                })
                .setPlayer(this._player)
                .setEnemy(this._currentEnemy)
                .render();

            $("body").append(this._battleBoard.$el);
        },

        _battleWon: function (xp) {
            $("body").append("<br>XP Received: " + xp);
            this._player.XP(xp);
            this._currentEnemy.remove();
            this._currentEnemy = new Enemy();
            this._battleBoard.resetEnemy(this._currentEnemy);
        },

        _battleDraw: function () {
            console.log("dr", arguments);
        },

        _battleLost: function () {
            console.log("ll", arguments);
        }
    });
    
    return new game()
});