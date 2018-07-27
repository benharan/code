/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"jquery",
	"underscore",
	"./Mutator"
], function ($, _, Mutator) {
	const
		hiddenClass = 'hide',
		fnFunctionSet = [
		['exists', function () {
			// return !!$(this).length;
			return !!this[0]; // Less actions
		}],
		['isEmpty', function () {
			return !this[0];
		}],
		['isVisible', function () {
			return $(this).hasClass(hiddenClass);
		}],
		['_show', function () {
			return $(this).removeClass(hiddenClass);
		}],
		['_hide', function () {
			return $(this).addClass(hiddenClass);
		}],
		['_toggleShow', function (flag) {
			if (_.isUn(flag)) {
				return $(this).toggleClass(hiddenClass);
			} else {
				return $(this)[flag ? '_show' : '_hide']();
			}
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
		}],
		['isnt', function (secondValue, caseSensitive) {
			return !toStr(this).is(secondValue, caseSensitive);
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
