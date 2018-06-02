/**
 * Created by Skeksify on 09/07/2016.
 */

define([], function () {
	return function (initData) {
		function set(trail, value) {
			const madeTrail = toArray(trail),
				endOfTrail = madeTrail.length - 1;

			let thisMap, nextMap = this.dataMap;

			madeTrail.forEach((milestone, milestoneIndex) => {
				thisMap = nextMap.get(milestone);

				if (milestoneIndex === endOfTrail) { // Last iteration
					nextMap.set(milestone, value);
				} else { // Keep going deeper
					if (!thisMap || thisMap.constructor !== Map) {
						nextMap.initOn(milestone);
						thisMap && console.warn('Existing value overridden by deeper maps', thisMap);
					}
					nextMap = nextMap.get(milestone); // Recurse in
				}
			})

			return thisMap; // Return overridden value if existed
		}

		function get(key) {
			try {
				return _get(key, this.dataMap);
			} catch (e) { }
		}

		function _get(trail, ds) {
			return toArray(trail).reduce((owningMap, milestone) => owningMap.get(milestone), ds);
		}

		function enhancedMap() {
			var result = new Map(initData);
			result.initOn = milestone => {
				result.set(milestone, enhancedMap());
			}
			return result;
		}

		function toArray(val) {
			return [].concat(val);
		}

		this.dataMap = enhancedMap();
		this.get = get;
		this.set = set;
	}
});
