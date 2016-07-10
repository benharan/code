/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils"
], function (_, $, Backbone, Displayable, Utils) {
    return Displayable.extend({

        _markup: '<div class="enemy_wrapper"><h3><div class="enemy_type"><%=type%></div></h3>' +
        '<div class="wrapper">Armor Class: <div class="enemy_armorClass"><%=armorClass%></div></div></div>',
        
        _name: null,
        _type: null,
        _attack: null,
        _armorClass: null,
        _damage: null,

        initialize: function (enemy_id) {
            var enemy;
            Displayable.prototype.initialize.call(this);

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
