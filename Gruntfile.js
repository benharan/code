var fs = require('fs'),
	TemplateCompiler = require('./templates/TemplateCompiler.js'),
	isSt = (obj) => typeof obj === 'string',
	cl = console.log;

module.exports = function (grunt) {
	var Compiler = new TemplateCompiler(grunt),
		stop = function () {
			grunt.fail.warn('## Aborted Manually ##\n\n');
		},
		fail = function (...args) {
			grunt.fail.warn(...args);
		},
		readFileSync = function (filePath) {
			var fileData;
			try {
				fileData = fs.readFileSync(filePath, "utf8");
			} catch (e) {
				cl(`File read exception for '${filePath}'\n\n`, e.message);
				stop();
			}
			return fileData;
		}

	require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks
	grunt.loadNpmTasks('grunt-contrib-requirejs');

	grunt.initConfig({
		babel: {
			options: {
				presets: ['env']
			},
			dist: {
				files: {
					'play_script_built.js': 'play_script.js'
				}
			}
		},
		polyfill: {
			options: {
				features: ['es6.symbol', 'es6.map', 'es6.promise'], // https://github.com/zloirock/core-js#features
				output: 'polyfill.js'
			}
		}

			,
			requirejs: {
				compile: {
					options: {
						baseUrl: './',
						mainConfigFile: 'scripts/libs/app/require_config.js',
						include: [ 'scripts/app_init.js' ],
						out: 'optimized.js',
						done: function(done, output) {
							console.log(done, output);
						}
					}
				}
			}
	});

	function readTemplate(filename) {
		grunt.log.write(`\nReading file '${'./templates/' + filename}'... `['cyan']);
		let phpTemplate = readFileSync('./templates/' + filename);
		grunt.log.ok();
		return phpTemplate;
	}

	function compileTemplate(filename, phpTemplate) {
		grunt.log.write(`Compiling '${filename}'... `['cyan']);
		let _Template = Compiler.compile(phpTemplate);
		grunt.log.ok();
		return _Template;
	}

	function writeTemplate(filename, _Template) {
		grunt.log.write(`Writing output... `['cyan']);
		fs.writeFileSync('./templates/_/' + filename, _Template.compiledContent);
		grunt.log.ok();
	}

	function logSummary(_Template) {
		grunt.log.writeln(`\nSummary:`['magenta']);
		grunt.log.writeln((_Template.deps.length ? `Dependencies: ${_Template.deps}` : 'No dependencies detected')['magenta']);
		grunt.log.writeln(`No constants fetched`['magenta']);
	}

	grunt.registerTask('Compile-Template', 'Transpile a PHP view into an Underscore.js Template', function () {
		let filename = grunt.option('file');
		if (isSt(filename)) {
			let phpTemplate = readTemplate(filename),
				_Template = compileTemplate(filename, phpTemplate);
			writeTemplate(filename, _Template);
			logSummary(_Template);
		} else {
			fail('Bad -file argument')
		}
	});

	grunt.registerTask('default', ['babel']);
	grunt.registerTask('compile', ['Compile-Template']);
};
//['white', 'black', 'grey', 'blue', 'cyan', 'green', 'magenta', 'red', 'yellow', 'rainbow']