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

        _xp: 0,
        _name: null,
        _attack: null,
        _armorClass: null,
        _damage: null,
        _level: null,

        initialize: function () {
            Displayable.prototype.initialize.call(this);
        },

        render: function () {

        },
        
        setStats: function (stats) {
            _.extend(this, stats);
        },

        getStat: function (stat) {
            return this["_" + stat]; // "_"
        },

        getAttack: function () {
            return this._attack;
        },

        getName: function () {
            return this._name;
        },

        XP: function (xp) {
            this._xp += xp;
            console.log(this._xp)
        }
    })
});
