/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "jquery",
	"underscore"
], function ($, _) {
	function toStr(str) { return '' + str; }

	$.elementAcc = function (action) {
		return (acc, item) => {
			const itemRes = action ? action(item) : item;
			return acc ? acc.add(itemRes) : itemRes
		}
	}

	$.fn._show = function () {
		return $(this).removeClass('displayNone');
	};

	$.fn._hide = function () { return $(this).addClass('displayNone'); };

	$.fn._toggleShow = function (flag) {
		var action;
		if (_.isUn(flag)) {
			action = $(this).hasClass('displayNone') ? '_show' : '_hide';
		} else {
			action = flag ? '_show' : '_hide';
		}
		return $(this)[action]();
	};

	$.fn.isChildOf = function ($ofThis) {
		var result;
		if (_.isSt($ofThis)) {
			result = !!this.parents($ofThis).length
		} else {
			result = $.contains($ofThis[0], this[0]);
		}
		return result;
	}

	function match(val1, val2, caseSensitive) {
		return caseSensitive ? (toStr(val1) === toStr(val2)) : (toStr(val1).toLowerCase() === toStr(val2).toLowerCase());
	}

	String.prototype.is = function (secondValue, caseSensitive) {
		return !_.isUn(_.find([].concat(secondValue), (val) => match(this, toStr(val), caseSensitive)));
	};

    // var S = function (str) {
    //     	var strInstance = new String(str);
    //     	strInstance.print = function() { console.log(this.toString()) }
    //         strInstance.is = function (compareStr) {
    //             return strInstance.toString() === compareStr.toString();
    //         }
    //     	return strInstance;
    //     },
    //     nativeFu = {
    //         html: $.fn.html
    //     }
	//
    //     $.fn.html = function () {
    //         return S(nativeFu.html.apply(this, arguments));
    //     }
});
