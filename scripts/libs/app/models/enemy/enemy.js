/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "text!../enemy/enemy.html",
    "text!../enemy/enemy.css"
], function (_, $, Backbone, Displayable, Utils, html, css) {
    return Displayable.extend({
        
        _name: null,
        _type: null,
        _attack: null,
        _armorClass: null,
        _damage: null,
        _level: null,

        initialize: function (enemy_id) {
            var enemy;
            Displayable.prototype.initialize.call(this, html, css);

            enemy = enemy_id ? Utils.getEnemyById(enemy_id) : Utils.getRandomEnemy();
            _.extend(this, enemy);
        },

        render: function () {
            Displayable.prototype.render.call(this, {
                name: this._name,
                type: this._type,
                attack: this._attack,
                armorClass: this._armorClass,
                damage: this._damage,
            });
            
            return this.$el;
        },
        
        getStat: function (stat) {
            return this["_" + stat]; // "_"
        },

        remove: function () {
            Displayable.prototype.remove.call(this);
            console.log("Removed")
        },
        
        calculateXP: function (playerLevel) {
            return this._level / playerLevel * 10;
        }
    })
});
