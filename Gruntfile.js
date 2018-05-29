module.exports = function(grunt) {

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
			features: ['es6.symbol', 'es6.promise'], // https://github.com/zloirock/core-js#features
			output: 'polyfill.js'
		}
	}
  });

  // Default task(s).
  grunt.registerTask('default', ['babel']);
};
