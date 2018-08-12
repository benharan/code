/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"jquery",
	"underscore",
	"./Mutator"
], function ($, _, Mutator) {
	const
		// {{ Dev Only Code {{
		ideSupporter = {
			check: ()=>{}, uncheck: ()=>{}, addClass: ()=>{}, removeClass: ()=>{}, toggleClass: ()=>{}, hasClass: ()=>{},
				_show: ()=>{}, _hide: ()=>{}, _toggleShow: ()=>{}, eq: ()=>{}, attr: ()=>{}, removeData: ()=>{},
				data: ()=>{}, swapElements: ()=>{}, aCl: ()=>{}, rCl: ()=>{},
				hide: ()=>{}, exit: ()=>{}, toggleCheck: ()=>{},
		},
		// }} Dev Only Code }}
		hiddenClass = 'hide',
		fnFunctionSet = [
		['f', $.fn.find],
		['aCl', $.fn.addClass],
		['rCl', $.fn.removeClass],
		['exists', function () {
			// return !!$(this).length;
			return !!this[0]; // Less actions
		}],
		['check', function () {
			return this.prop('checked', true);
		}],
		['isChecked', function () {
			return this.prop('checked');
		}],
		['uncheck', function () {
			return this.prop('checked', false);
		}],
		['toggleCheck', function (flag) {
			return this.prop('checked', !!flag);
		}],
		['disable', function () {
			return this.prop('disabled', true).addClass('disabled');
		}],
		['enable', function () {
			return this.prop('disabled', false).removeClass('disabled');
		}],
		['isEmpty', function () {
			return !this[0];
		}],
		['isVisible', function () {
			return this.hasClass(hiddenClass);
		}],
		['_show', function () {
			return this.removeClass(hiddenClass);
		}],
		['_hide', function () {
			return this.addClass(hiddenClass);
		}],
		['_toggleShow', function (flag) {
			if (_.isUn(flag)) {
				return this.toggleClass(hiddenClass);
			} else {
				return this[flag ? '_show' : '_hide']();
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
			$.swapElements(this, $withThis);
		}],
		[['setup', 'config', 'apply'], function (actionSet) {
			_.e(actionSet, (params, action) => this[action](...[].concat(params)));
		}]
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
	];

	Mutator.mutate($, functionSet, '$');
	Mutator.mutate($.fn, fnFunctionSet, '$.fn');
});
