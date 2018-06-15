/**
 * Created by Skeksify on 09/07/2016.
 */

define([
	"underscore",
	"jquery",
	"Backbone"
], function (_, $, Backbone) {

	function isFu(fu) {
		return typeof(fu) === 'function';
	}

	function applyOrGetSelf(def, deps) {
		return isFu(def) ? def.apply(null, deps) : def;
	}

	return Backbone.Model.extend({
		initialize: function () {
			this.loadedComponents = {};
			this.initializedComponents = {};
		},

		get: function (name) {
			return this.loadedComponents[name];
		},

		load: function (name, deps, definition) {
			this.loadedComponents[name] = {
				deps,
				definition
			}
		},

		// init: function () {
		// 	var name;
		// 	debugger;
		// 	for (name in this.loadedComponents) {
		// 		if (this._attemptToInitScript(name)) {
		// 			this.initializedComponents[name] = this.loadedComponents[name]();
		// 		}
		// 	}
		// },

		areLoaded: function(col) {
			return this._allScriptsLoadedInArray(col);
		},

		export: function () {
			return JSON.stringify(this.loadedComponents);
		},

		import: function (dataJSON) {
			this.loadedComponents = JSON.parse(dataJSON);
		},

		_buildDepsReferences: function (depsArr) {
			return depsArr.reduce(function (result, depName) {
				result.push(this.initializedComponents[depName]);
				return result;
			}, [])
		},

		_loadComponent: function (name) {
			var deps = this.loadedComponents[name].deps,
				depsRefArray = this._buildDepsReferences(deps);

			this.initializedComponents[name] = applyOrGetSelf(this.loadedComponents[name].definition, depsRefArray);
		},

		_allScriptsLoadedInArray: function (collection) {
			return collection.reduce((result, script) => result && !!this.initializedComponents[script], true)
		},

		_attemptToInitScript: function (name) {
			if (this._allScriptsLoadedInArray(this.loadedComponents[name].deps)) {
				this._loadComponent(name);
			}
		}
	})
});