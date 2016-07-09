/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery"
], function (_, $) {
    var enemiesById = {
        goblin: {
            _type: "Goblinoid",
            _attack: 2,
            _armorClass: 10,
            _damage: "1d6"
        }
    }
    return {
        rand: function (a, b) {
            var rndVal = Math.random(),
                result;
            
            if (a && b) {
                result = parseInt((b-a)*rndVal)+a;
            } else if (a) {
                result = parseInt(a*rndVal);                
            } else {
                result = rndVal;
            }
            
            return result;
        },
        
        addToBody: function (markup) {
            $("body")
                .append("<br/>")
                .append(markup)
        },

        getEnemyById: function (enemy_id) {
            return enemiesById[enemy_id]
        }
    };
});