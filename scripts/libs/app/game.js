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
        start: function () {
            var battleBoard = new BattleBoard(),
                player = new Player(),
                enemy = new Enemy("goblin");

            player.setStats({
                _name: "Rhorgrar",
                _attack: 1,
                _armorClass: 10,
                _damage: "1d3"
            })

            battleBoard
                .setPlayer(player)
                .setEnemy(enemy)
                .render();

            $("body").append(battleBoard.$el);

        }
    });
    
    return new game()
});