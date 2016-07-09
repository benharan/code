/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "./models/battleBoard/battleBoard",
    "./models/enemy/enemy"
], function (_, $, Backbone, BattleBoard, Enemy) {


//     var Goblin = new Enemy({ name: "Goblin" }),
//         Hobgoblin = new Enemy({ name: "Hobgoblin" }),
//         Troll = new Enemy({ name: "Troll" }),
//         ForestArea = new Enemies();
//
//     ForestArea.add(Goblin);
//     ForestArea.add(Hobgoblin);
//     ForestArea.add(Troll);
//
//     enemiesTableElem
    var game = Backbone.Model.extend({
        start: function () {
            var battleBoard = new BattleBoard(),
                enemy = new Enemy("goblin");

            battleBoard.render();
            
            $("body").append(battleBoard.$el);
            
            battleBoard.loadEnemy(enemy);
        }
    });
    return new game()
});