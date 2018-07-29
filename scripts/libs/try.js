define("try", [], {
	load: function (moduleName, parentRequire, onLoad, config) {
		var onLoadSuccess = function (module) {
				onLoad(module);
			},
			onLoadFailure = function (err) {
				var optionalModuleId = err.requireModules && err.requireModules[0];
				requirejs.undef(optionalModuleId);
				define(optionalModuleId, [], function(){ return null; });
				parentRequire([optionalModuleId], onLoadSuccess);
			}

		parentRequire([moduleName], onLoadSuccess, onLoadFailure);
	}
});