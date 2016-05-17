'use strict';

var path = require('path');

module.exports = function(grunt) {

	// Unified Watch Object
	var watchFiles = {
		serverJS: ['server.js', 'config/**/*.js', 'app/**/*.js'],
		buildJS: ['target/**/*.js'],
		mochaTests: ['app/tests/**/*.js']
	};

	// Project Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		watch: {
			serverJS: {
				files: watchFiles.serverJS,
				tasks: ['eslint', 'babel'],
				options: {
					livereload: false
				}
			}
		},
		eslint: {
			options: {
		        configFile: '.eslintrc'
	      	},
	        target: watchFiles.serverJS
	    },
		clean: {
		  build: ['target'],
		},
		babel: {
			options: {
				sourceMap: true,
				presets: ['es2015', 'stage-0']
			},
			build: {
				files: [{
					expand: true,
					src: watchFiles.serverJS,
					dest: 'target/src/'
				}]
			}
		},

		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					nodeArgs: ['--debug'],
					ext: 'js,html',
					watch: watchFiles.buildJS,
					ignore: ['node_modules/**'],
					cwd: path.resolve('./target/src'),
					env: {
						MONGO_HOST: 'localhost',
						PORT: '3000'
					}
				}
			}
		},
		'node-inspector': {
			custom: {
				options: {
					'web-port': 1336,
					'web-host': 'localhost',
					'debug-port': 5859,
					'save-live-edit': true,
					'no-preload': true,
					'stack-trace-limit': 50,
					'hidden': []
				}
			}
		},
		
		concurrent: {
			default: ['eslint', 'nodemon', 'watch'],
			debug: ['nodemon', 'watch', 'node-inspector'],
			options: {
				logConcurrentOutput: true,
				limit: 10
			}
		}
		
	});

	// Load NPM tasks
	require('load-grunt-tasks')(grunt);

	// Making grunt default to force in order not to break the project.
	grunt.option('force', true);

	grunt.registerTask('default', ['clean', 'build', 'concurrent:default']);

	grunt.registerTask('build', ['eslint', 'clean', 'babel']);

};
