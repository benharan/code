/**
 * Created by Skeksify on 09/07/2016.
 */

define([], function () {
	return function () {
		var loadedComponents = {},
			initializedComponents = {};

		function isFu(fu) {
			return typeof(fu) === 'function';
		}

		function applyOrGetSelf(def, deps) {
			return isFu(def) ? def.apply(null, deps) : def;
		}

		function buildDepsReferences(depsArr) {
			return depsArr.reduce(function (result, depName) {
				result.push(initializedComponents[depName]);
				return result;
			}, [])
		}

		function loadComponent(name) {
			var deps = loadedComponents[name].deps,
				depsRefArray = buildDepsReferences(deps);

			initializedComponents[name] = applyOrGetSelf(loadedComponents[name].definition, depsRefArray);
		}

		function allScriptsLoadedInArray(collection) {
			return collection.reduce(function (result, script) {
				return result && !!initializedComponents[script];
			}, true)
		}

		function attemptToInitScript(name) {
			if (allScriptsLoadedInArray(loadedComponents[name].deps)) {
				loadComponent(name);
			}
		}

		this.getLoaded = function (name) {
			return loadedComponents[name];
		}

		this.load = function (name, deps, definition) {
			loadedComponents[name] = {
				deps,
				definition
			}
		}

		this.init = function () {
			var name;
			debugger;
			for (name in loadedComponents) {
				if (attemptToInitScript(name)) {
					initializedComponents[name] = loadedComponents[name]();
				}
			}
		}

		this.areLoaded = (col) => allScriptsLoadedInArray(col);
	}
});
