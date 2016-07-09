/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery"
], function (_, $) {
    return {
        rand: function (a, b) {
            var rndVal = Math.random(),
                result;
            
            if (a && b) {
                result = parseInt((b-a)*rndVal)+a;
            } else if (a) {
                result = parseInt(a*rndVal);                
            } else {
                result = rndVal;
            }
            
            return result;
        },
        
        addToBody: function (markup) {
            $("body")
                .append("<br/>")
                .append(markup)
        }
    };
});