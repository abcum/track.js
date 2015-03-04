module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// JS
		// ++++++++++++++++++++++++++++++++++++++++++++++++++

		concatinclude: {

			track: {
				files: {
					'track.js': ['lib/include.inc']
				}
			},

		},

		// ++++++++++++++++++++++++++++++++++++++++++++++++++
		// Uglify
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

		}

	});

	// ++++++++++++++++++++++++++++++++++++++++++++++++++
	// Load NPMs
	// ++++++++++++++++++++++++++++++++++++++++++++++++++

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-concat-include');

	// ++++++++++++++++++++++++++++++++++++++++++++++++++
	// Tasks
	// ++++++++++++++++++++++++++++++++++++++++++++++++++

	grunt.registerTask('default', [
        'concatinclude:track',
        'uglify:track'
	]);

};
