var fs = require('fs'),
	TemplateCompiler = require('./templates/TemplateCompiler.js'),
	isSt = (obj) => typeof obj === 'string',
	cl = console.log;

module.exports = function (grunt) {
	var Compiler = new TemplateCompiler(),
		stop = function () {
			grunt.fail.warn('## Stopping Execution ##\n\n');
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
	});

	grunt.registerTask('Compile-Template', 'Transpile a PHP view into an Underscore.js Template', function () {
		let filename = grunt.option('file');
		if (isSt(filename)) {
			let phpTemplate = readFileSync('./templates/' + filename),
				_Template = Compiler.compile(phpTemplate);

			cl(`Deps: ${_Template.deps}`);
			fs.writeFileSync('./templates/_/' + filename, _Template.compiledContent);
		} else {
			cl('Bad @file')
		}
	});

	// Default task(s).
	grunt.registerTask('default', ['babel']);
	grunt.registerTask('compile', ['Compile-Template']);
};
