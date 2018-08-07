const fs = require('fs'),
	_ = require('./scripts/libs/underscore'),
	TemplateCompiler = require('./templates/TemplateCompiler'),
	gitActions = require('./scripts/grunt-scripts/git-actions'),
	chalk = require('chalk'),
	chalks = {
		вопрос: chalk.cyan,
		// def: chalk.rgb(15, 100, 204),
		def: chalk.magenta,
		su: chalk.hex('#e16c0e')
	},
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
				grunt.fail.warn(`File read exception for '${filePath}'\n\n`, e.message);
			}
			return fileData;
		},
		timer = function () {
			var startTime = (new Date()).getTime();
			this.end = function () {
				return ((new Date()).getTime() - startTime - Math.random() / 4).toFixed(3) + 'ms';
			}
		},
		tFiles, es6AssetsChanged, oldAssetsChanged;

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
		},
		requirejs: {
			compile: {
				options: {
					baseUrl: './',
					mainConfigFile: 'scripts/libs/app/require_config.js',
					include: ['scripts/app_init.js'],
					out: 'optimized.js',
					done: function (done, output) {
						console.log(done, output);
					}
				}
			}
		},

		// config: 'config.name', // arbitrary name or config for any other grunt task
		// type: '<question type>', // list, checkbox, confirm, input, password
		// message: 'String|function(answers)', // Question to ask the user, function needs to return a string,
		// default: 'value', // default value if nothing is entered
		// choices: 'Array|function(answers)',
		// validate: function(value), // return true if valid, error message if invalid. works only with type:input
		// filter:  function(value), // modify the answer
		// when: function(answers) // only ask this question when this function returns true
		prompt: {
			selectAssets: {
				options: {
					questions: [
						{
							config: 'selectAssets.selected',
							type: 'checkbox',
							message: chalks.вопрос('Select assets to upload: '),
							choices: () => oldAssetsChanged,
							when: () => !!oldAssetsChanged
						},
						{
							config: 'selectES6Assets.selected',
							type: 'checkbox',
							message: chalks.вопрос('Select ES6 assets to upload: '),
							choices: () => es6AssetsChanged,
							when: () => !!es6AssetsChanged
						}
					]
				}
			},
			Wizard: {
				options: {
					questions: [
						{
							config: 'wiz.conf',
							type: 'confirm',
							message: chalk.cyan('Do you conform? ') + chalks.def('(Default: Yes)'),
							default: true,
						},
						{
							config: 'wiz.music',
							type: 'list',
							message: chalk.cyan('Best genre? ') + chalks.def('(Default: Metal)'),
							default: 'Metal',
							choices: [
								'Metal', 'Trance', 'Classic'
							]
						},
						{
							config: 'wiz.nuts',
							type: 'checkbox',
							message: chalks.вопрос('Best nut? ') + chalks.def('(Default: Cashew)'),
							default: 'Cashew',
							choices: [
								'Almonds', 'Walnuts', 'Peanuts', 'Cashew'
							]
						},
						{
							config: 'wiz.name',
							type: 'checkbox',
							message: chalks.вопрос('Your name please'),
							validate: input => {
								if (input) {
									return true;
								} else {
									return 'Mandatory field'
								}
							},
							choices: [
								{name: 'Ben', value: 'skeksify', checked: true},
								{name: 'Beno', value: 'skeksifyo', checked: true},
								{name: 'Doe', value: 'Smoe'}
							]
						},
					]
				}
			},
			templateFileName: {
				options: {
					questions: [
						{
							config: 'templateFileName.file',
							type: 'checkbox',
							message: chalks.вопрос('Select files to compile ') + chalks.def('(Mark none for all)'),
							choices: () => {
								tFiles = fs.readdirSync('./templates/').filter(file => /\.html$|\.phtml$|\.php$/.exec(file));
								return tFiles;
							},
							when: () => !grunt.option('file')
						}
					]
				}
			},
		}
	});

	function readTemplate(filename) {
		let fullPath = './templates/' + filename;
		grunt.log.write(`\nReading file '${fullPath}'... `['cyan']);
		let phpTemplate = readFileSync(fullPath);
		grunt.log.ok();
		return phpTemplate;
	}

	function compileTemplate(filename, phpTemplate) {
		grunt.log.write(`Compiling... `['cyan']);
		let _Template = Compiler.compile(phpTemplate);
		grunt.log.ok();
		return _Template;
	}

	function writeTemplate(filename, _Template) {
		grunt.log.write(`Writing file './templates/_/${filename}'... `['cyan']);
		fs.writeFileSync('./templates/_/' + filename, _Template.compiledContent);
		grunt.log.ok();
	}

	function logStr(p, s) {
		grunt.log.writeln(chalks[p](s));
	}

	function logSummary(_Template, compTimer) {
		logStr('su', `\nSummary:`);
		logStr('su', _Template.deps.length ? `Dependencies: ${_Template.deps}` : 'No dependencies detected');
		logStr('su', `No constants fetched`);
		logStr('su', `Duration: ${compTimer.end()}`);
	}

	grunt.registerTask('Compile-Template', 'Transpile a PHP view into an Underscore.js Template', function () {
		let fileParam = grunt.option('file'),
			markedFiles = grunt.config('templateFileName.file');

		[].concat(fileParam || (markedFiles.length ? markedFiles : tFiles)).forEach(filename => {
			let compTimer = new timer(),
				phpTemplate = readTemplate(filename),
				_Template = compileTemplate(filename, phpTemplate);
			writeTemplate(filename, _Template);
			logSummary(_Template, compTimer);
		})
	});

	grunt.registerTask('deboo', '', function () {
		grunt.log.writeln(grunt.config('wiz.conf'));
		grunt.log.writeln(grunt.config('wiz.music'));
		grunt.log.writeln(grunt.config('wiz.nuts'));
		grunt.log.writeln(grunt.config('wiz.name'));
	});
	grunt.registerTask('debugCollect', '', function () {
		grunt.log.writeln(grunt.config('selectAssets.selected'));
	});

	grunt.registerTask('scan-git-changes', 'Soak changed assets from "git status"', function () {
		const done = this.async();

		gitActions.getModifiedScripts().then((tracedAssets = {}) => {
			// oldAssetsChanged = tracedAssets.js ? _.keys(tracedAssets.js) : null;
			// es6AssetsChanged = tracedAssets.new_js ? _.keys(tracedAssets.new_js) : null;
			oldAssetsChanged = tracedAssets.modules ? _.keys(tracedAssets.modules) : null;
			if (!oldAssetsChanged) {
				fail('No script changes found, terminating...');
			} else {
				done();
			}
		})
	});

	grunt.registerTask('default', ['babel']);
	grunt.registerTask('compile', ['prompt:templateFileName', 'Compile-Template']);
	grunt.registerTask('prompty', ['prompt:Wizard', 'deboo']);
	grunt.registerTask('collect', ['scan-git-changes', 'prompt:selectAssets', 'debugCollect']);
};
