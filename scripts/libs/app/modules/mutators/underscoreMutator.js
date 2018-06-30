/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone"
], function (_, $, Backbone) {

	const functionSet = [
		['isntEmpty', obj => !_.isEmpty(obj)],
		['isUn', _.isUndefined],
		['isSt', _.isString],
		['isNu', _.isNumber],
		['e', _.each],
		['swap', function (arr, i1, i2) {
			const first = arr[i1];
			arr[i1] = arr[i2];
			arr[i2] = first;
			return arr;
		}],
		['relocate', function(arr, from, to) {
			arr.splice(to, 0, arr.splice(from, 1)[0]);
			return arr;
		}],
		['injectByIndices', function (arr, indices, itemsArray) {
			let i = 0;
			_.e(indices, index => {
				arr.splice(index, 0, itemsArray[i++]);
			})
			return arr;
		}],
		['extractByIndices', function (arr, indices) {
			let result = [],
				gaps = [], offset = 0,
				fillGaps = arr.length > 1; // Need to fill gaps to maintain indices for multiple removals

			_.e(indices, index => {
				if (fillGaps) {
					result.push(arr.splice(index, 1, undefined)[0]);
					gaps.push(index);
				} else { // Quandary! Differentiate between undefined and no param
					result.push(arr.splice(index, 1)[0]);
				}
			})

			if (fillGaps) {
				_.e(gaps, gapIndex => {
					arr.splice(gapIndex - (offset++), 1);
				})
			}

			return result;
		}]
	]

	function setUnderscoreFunction(fuName, fu) {
		if (_[fuName]) {
			throwError('Underscore Mutation Exception', `Function '${fuName}' already exists`);
		} else {
			_[fuName] = fu;
		}
	}

	functionSet.map(mapping => setUnderscoreFunction.apply(null, mapping));
});
