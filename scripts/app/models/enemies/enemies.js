/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "utils",
    "../../models/enemy/enemy"
], function (_, $, Backbone, Utils, Enemy) {
    return Backbone.Model.extend({

        _enemies: null,
        _size: 0,

        initialize: function (size) {
            var EnemyCollection = Backbone.Collection.extend({
                model: Enemy
            })

            this._enemies = new EnemyCollection();
            this._size = size;
        },

        generateEnemies: function () {
            var i;

            for (i=0;i<this._size;i++) {
                this._enemies.add(new Enemy());
            }

            Utils.addToBody("OK!");
            Utils.addToBody(Utils.rand(6, 10));

        }
    })
});
