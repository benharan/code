/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "jquery"
], function ($) {

	$.elementAcc = function (action) {
		return (acc, item) => {
			const itemRes = action ? action(item) : item;
			return acc ? acc.add(itemRes) : itemRes
		}
	}

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
            return S(nativeFu.html.apply(this, arguments));
        }
});
