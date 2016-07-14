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

        initialize: function (enemy_id) {
            var enemy;
            Displayable.prototype.initialize.call(this, html, css);

            enemy = Utils.getEnemyById(enemy_id);
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
            this._cacheDom({
                type: ".enemy_type",
                attack: ".enemy_attack",
                armorClass: ".enemy_armorClass",
                damage: ".enemy_damage"
            })
            
            return this.$el;
        },
        
        getStat: function (stat) {
            return this["_" + stat]; // "_"
        }
    })
});
