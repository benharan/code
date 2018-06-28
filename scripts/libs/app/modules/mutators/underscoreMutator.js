/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {
    _.isntEmpty = obj => !_.isEmpty(obj);
    _.isUn = _.isUndefined;
	_.isSt = _.isString;
});
