define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {


	const typeRegexMap = {
		'price': /^\d{1,3}(,(\d{3}))*(\.\d+)?$/,
		'percent': /^\+?\d{1,3}(,(\d{3}))*(\.\d+)?%$/
	},
    extractValue = {
		'price': val => +val.replace(/,/g, ''),
	    'percent': val => +val.replace(/[\+%,]/g, '')
    };

    return Backbone.Model.extend({
        initialize: function () {
            // Ascertain local format
        },
        is: function (type, value) {
            return !!typeRegexMap[type].exec(value);
        },
        getValue: function (type, value) {
			return extractValue[type](value);
		}
    });
});
