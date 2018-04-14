define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone, MainFrame, Router) {
    return Backbone.Model.extend({
        initialize: function () {

        },
        St: function (possibleString) { return _.isString(possibleString) },
        Fu: function (possibleFunction) { return _.isFunction(possibleFunction) },
/*Arr!*/Arr: function (possibleArray) { return possibleArray && possibleArray.constructor === Array; }
    });
});
