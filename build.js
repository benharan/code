(function () {
	const filesToCleanse = [
		"Toolset/Toolset",
		"app/investing",
		"Modules/Mutators/jQueryMutator"
	];

	function adjustLibPath(result) {
		return result.replace(/baseUrl: \"\/scripts\/libs\"/, 'baseUrl: \"\"');
	}

	function shrugOffDevCode(contents) {
		return contents.replace(/\/\/\s\{\{\sDev\sOnly\sCode\s\{\{((?!\/\/\s\}\}\sDev\sOnly\sCode\s\}\})[^])*\/\/\s\}\}\sDev\sOnly\sCode\s\}\}/g, '');
	}

	return ({
		dir: "built/",
		baseUrl: "scripts/libs/",
		mainConfigFile: 'scripts/libs/app/require_config.js',
		paths: {
			// jquery: "empty:",
			// underscore: "empty:",
			// Backbone: "empty:"
		},
		useStrict: true,
		inlineText: true,
		removeCombined: true,
		optimize: "none",
		// optimizeCss: "none",
		fileExclusionRegExp: /^schemes$/,
		onBuildWrite: function (moduleName, path, contents) {
			var result = contents;

			if (~filesToCleanse.indexOf(moduleName)) {
				result = shrugOffDevCode(result);
			}

			if (path === 'D:/Code/Enigma/built/app/require_config.js') {
				result = adjustLibPath(result);
			}
			return result;
		},
		modules: [
			{
				name: "app_init",
				include: [
					"backbone",
					"jquery",
					"underscore",
					"app/main",
					"app/investing",
					"app/modules/mainContent/mainContentView",
					"app/modules/indices/MajorIndicesView"
				],
				exclude: [ "Modules/ControlPanel/ControlPanelView" ]
			}, {
				name: "app/modules/Portfolios/Portfolios",
				exclude: [ "app_init" ]
			}
		]
	})
})()