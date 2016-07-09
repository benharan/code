/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "./models/enemies/enemies"
], function (_, $, BB, Enemies) {


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
    
    return {
        start: function () {
            var enemyGroup = new Enemies(3);

            enemyGroup.generateEnemies();
        }
    }
});