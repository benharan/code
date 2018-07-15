define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone, MainFrame, Router) {
    return Backbone.Model.extend({
        initialize: function () {

        },
        capitalizeWord: function (word) {
            return word.substr(0, 1).toUpperCase() + word.substr(1);
        }
    });
});
