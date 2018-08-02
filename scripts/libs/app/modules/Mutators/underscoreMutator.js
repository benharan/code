/**
 * Created by Skeksify on 09/07/2016.
 */

define([
    "underscore",
    "jquery",
    "Backbone",
	"./Mutator"
], function (_, $, Backbone, Mutator) {
	const
		ideSupporter = {
			tryRun: () => { },
		},
		functionSet = [
		['isE', _.isEmpty],
		['isntEmpty', obj => !_.isEmpty(obj)],
		['isntE', _.isntEmpty],
		['isUn', _.isUndefined],
		['isSt', _.isString],
		['isNu', _.isNumber],
		['e', _.each],
		['tryRun', function (fu, ...params) {
			return _.isFunction(fu) && fu(...params);
		}],
		['bindSet', function (set, context) {
			return set.map(fu => fu.bind(context));
		}],
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
				} else { // Splice counts args.length (wisely)
					result.push(arr.splice(index, 1)[0]);
				}
			})

			if (fillGaps) {
				_.e(gaps, gapIndex => {
					arr.splice(gapIndex - (offset++), 1);
				})
			}

			return result;
		}],
		['getByIndices', function (arr, indices) {
			let result = [];

			_.e(indices, index => {
				result.push(arr.slice(+index, +index + 1)[0]);
			})

			return result;
		}],
		['existsIn', function (arr, value) {
			return _.indexOf(arr, value) > -1;
		}],
		['valueOr', function (value, alternative) {
			return !_.isUn(value) ? value : alternative;
		}]
	]

	Mutator.mutate(_, functionSet, 'Underscore');
});
