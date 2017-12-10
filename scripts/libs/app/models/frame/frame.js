/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
    "Displayable",
    "utils",
    "text!../frame/frame.html",
    "text!../frame/frame.css"
], function (_, $, Backbone, Displayable, Utils, html, css) {
    return Displayable.extend({

        _player: null,
        _enemy: null,
        _enemies: null,
        _currentEnemyIndex: 0,
        _battleControls: null,
        _nextBehavior: null,
        _markupScheme: {
            "total": ".battleBoard_total",
            "foeTotal": ".battleBoard_foeTotal",
            "glt": ".battleBoard_glt",
            "playerTotal": ".battleBoard_playerTotal",
            "enemyWrap": ".battleBoard_enemyWrapper",
            "next": ".battleBoard_next"
        },

        initialize: function () {
            Displayable.prototype.initialize.call(this, html, css);

        },

        render: function () {
            Displayable.prototype.render.call(this, {}, this._markupScheme);

            return this.$el;
        },

        events: {
            "click .battleBoard_next": "_next"
        }
    })
});
