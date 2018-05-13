/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "jquery"
], function ($) {

    var S = function (str) {
        	var strInstance = new String(str);
        	strInstance.print = function() { console.log(this.toString()) }
            strInstance.is = function (compareStr) {
                return strInstance.toString() === compareStr.toString();
            }
        	return strInstance;
        },
        nativeFu = {
            html: $.fn.html
        }

        $.fn.html = function () {
            debugger;
            return S(nativeFu.html.apply(this, arguments));
        }
});
