/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"jquery",
	"underscore",
	"./Mutator"
], function ($, _, Mutator) {
	const fnFunctionSet = [
		['exists', function () {
			// return !!$(this).length;
			return !!this[0]; // Less actions
		}],
		['isEmpty', function () {
			return !this[0];
		}],
		['_show', function () {
			return $(this).removeClass('displayNone');
		}],
		['_hide', function () {
			return $(this).addClass('displayNone');
		}],
		['_toggleShow', function (flag) {
			var action;
			if (_.isUn(flag)) {
				action = $(this).hasClass('displayNone') ? '_show' : '_hide';
			} else {
				action = flag ? '_show' : '_hide';
			}
			return $(this)[action]();
		}],
		['isChildOf', function ($ofThis) {
			var result;
			if (_.isSt($ofThis)) {
				result = !!this.parents($ofThis).length
			} else {
				result = $.contains($ofThis[0], this[0]);
			}
			return result;
		}],
		['swapWith', function ($withThis) {
			$.swapElements($(this), $withThis);
		}],
		['', ],
	],
	functionSet = [
		['elementAcc', function (action) {
			return (acc, item) => {
				const itemRes = action ? action(item) : item;
				return acc ? acc.add(itemRes) : itemRes
			}
		}],
		['swapElements', function ($first, $second) { // Make two DOM elements trade places
			var $worthlessSpan = $('<span/>');
			$first.after($worthlessSpan);
			$second.after($first);
			$worthlessSpan.after($second).remove();
		}],
		['is$elem', function ($possibleElem) {
			return $possibleElem instanceof $;
		}]
	],
	StringFunctionSet = [
		['is', function (secondValue, caseSensitive) {
			return !_.isUn(_.find([].concat(secondValue), (val) => match(this, toStr(val), caseSensitive)));
		}]
	];

	function toStr(str) {
		return '' + str;
	}

	function match(val1, val2, caseSensitive) {
		return caseSensitive ? (toStr(val1) === toStr(val2)) : (toStr(val1).toLowerCase() === toStr(val2).toLowerCase());
	}

	Mutator.mutate($, functionSet, '$');
	Mutator.mutate($.fn, fnFunctionSet, '$.fn');
	Mutator.mutate(String.prototype, StringFunctionSet, 'String.prototype');
});
