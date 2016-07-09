/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
    return Backbone.Model.extend({
        
        _type: null,
        
        initialize: function (type) {
            this._type = type;
        },
        
        generateEnemies: function () {
            console.log(this._type);
        }
    })
});
