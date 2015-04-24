module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// CLEAN
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		clean: {

			all: ['track.js'],

		},

		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// CONCAT
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		concatinclude: {

			track: {
				files: {
					'track.js': ['lib/include.inc']
				}
			},

		},

		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// UGLIFY
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		uglify: {

			options: {
				wrap: true,
				report: 'min',
				compress: true,
				banner: '/*! \n * Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %> \n * Created <%= grunt.template.today("yyyy-mm-dd hh:MM:ss Z") %> \n */ \n\n'
			},

			track: {
				files: [{
					expand: true,
					src: 'track.js',
				}]
			}

		},

		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// JSHint
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		jshint: {

			files: ['gruntfile.js'],
			options: {
				'-W099': true,
			}

		}

	});

	// ++++++++++++++++++++++++++++++++++++++++++++++++++
	// Load NPMs
	// ++++++++++++++++++++++++++++++++++++++++++++++++++

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-concat-include');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// ++++++++++++++++++++++++++++++++++++++++++++++++++
	// Tasks
	// ++++++++++++++++++++++++++++++++++++++++++++++++++

	grunt.registerTask('test', [
		'jshint',
	]);

	grunt.registerTask('deploy', [
		'clean',
		'concatinclude',
		'uglify'
	]);

};
