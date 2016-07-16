/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "text!../player/player.html",
    "text!../player/player.css"
], function (_, $, Backbone, Displayable, Utils, html, css) {
    return Displayable.extend({

        _xp: 0,
        _hp: 0,
        _name: null,
        _attack: null,
        _armorClass: null,
        _damage: null,
        _level: null,

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);
        },

        render: function () {
            Displayable.prototype.render.call(this, {}, {
                "xpBar": ".player_xpBar",
                "xpAmount": ".player_xpAmount"
            });

            this._updateXPBar();

            return this.$el;
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
            this._updateXPBar();
        },

        _updateXPBar: function () {
            var totalForThisLevel = this._level*100,
                percentOfLevel = this._xp/totalForThisLevel*100;

            this._dom.xpAmount.text(this._xp);
            this._dom.xpBar.css("width", percentOfLevel.toFixed(2) + "%");

        }
    })
});
