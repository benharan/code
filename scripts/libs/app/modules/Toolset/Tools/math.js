define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
    return Backbone.Model.extend({
        initialize: function () {

        },
        rand: function (a, b) {
            var rndVal = Math.random(), result;
            if (a && b) {
                result = parseInt((b-a)*rndVal)+a;
            } else if (a) {
                result = parseInt(a*rndVal);
            } else {
                result = rndVal;
            }

            return result;
        }
    });
});
