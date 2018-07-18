({
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
		//Always return a value.
		if (path === 'D:/Code/Enigma/built/app/require_config.js') {
			contents = contents.replace(/baseUrl: \"\/scripts\/libs\"/, 'baseUrl: \"\"');
		}
		return contents;
	},
	modules: [
		{
			name: "app_init",
			include: [
				"backbone",
				"jquery",
				"underscore",
				"app/main",
				"app/modules/mainContent/mainContentView",
				"app/modules/indices/MajorIndicesView"
			]
		}, {
			name: "app/modules/Portfolios/Portfolios",
			exclude: [ 'app_init' ]
		}
	]
})