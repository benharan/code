({
	baseUrl: "scripts/libs/",
	mainConfigFile: 'scripts/libs/app/require_config.js',
	paths: {
		jquery: "empty:",
		underscore: "empty:",
		Backbone: "empty:"
	},
	optimize: "none",
	name: "app/main",
	// name: "scripts/app_init",
	out: "main-built.js"
})