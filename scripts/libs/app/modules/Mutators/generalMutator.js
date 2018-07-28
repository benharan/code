/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"jquery",
	"underscore",
	"./Mutator"
], function ($, _, Mutator) {
	function makeTosser(type) {
		return (mainLabel, ...args) => {
			let output = [`__ Runtime ${type}: ${mainLabel}`].concat(args.join(', ')).join('');
			if (type === 'Error') {
				throw new Error(output);
			} else {
				console.warn(output)
			}
		}
	}

	const
		WindowFunctionSet = [
			['throwError', makeTosser('Error')],
			['announceWarn', makeTosser('Warning')]
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

	Mutator.mutate(String.prototype, StringFunctionSet, 'String.prototype');
	Mutator.mutate(window, WindowFunctionSet, 'Window');
});
