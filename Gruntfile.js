'use strict';
module.exports = function (grunt) {

	// load all tasks
	require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

	grunt.config.init(
		{
			pkg: grunt.file.readJSON('package.json'),

			dirs           : {
				css: '/assets/css',
				js : '/assets/js',
				main: '/'
			},
			checktextdomain: {
				standard: {
					options: {
						text_domain       : ['download-monitor-integration-for-woocommerce'], //Specify allowed domain(s)
						create_report_file: 'true',
						keywords          : [ //List keyword specifications
							'__:1,2d',
							'_e:1,2d',
							'_x:1,2c,3d',
							'esc_html__:1,2d',
							'esc_html_e:1,2d',
							'esc_html_x:1,2c,3d',
							'esc_attr__:1,2d',
							'esc_attr_e:1,2d',
							'esc_attr_x:1,2c,3d',
							'_ex:1,2c,3d',
							'_n:1,2,4d',
							'_nx:1,2,4c,5d',
							'_n_noop:1,2,3d',
							'_nx_noop:1,2,3c,4d'
						]
					},
					files  : [
						{
							src   : [
								'**/*.php',
								'!**/node_modules/**',
								'!**/license-checker/**',
							], //all php
							expand: true
						}
					]
				}
			},
			makepot        : {
				target: {
					options: {
						cwd            : '',                          // Directory of files to internationalize.
						domainPath     : 'languages/',         // Where to save the POT file.
						exclude        : [],                      // List of files or directories to ignore.
						include        : [],                      // List of files or directories to include.
						mainFile       : 'download-monitor-integration-for-woocommerce.php',                     // Main project file.
						potComments    : '',                  // The copyright at the beginning of the POT file.
						potFilename    : 'download-monitor-integration-for-woocommerce.pot',                  // Name of the POT file.
						potHeaders     : {
							poedit                 : true,                 // Includes common Poedit headers.
							'x-poedit-keywordslist': true // Include a list of all possible gettext functions.
						},                                // Headers to add to the generated POT file.
						processPot     : null,                 // A callback function for manipulating the POT file.
						type           : 'wp-plugin',                // Type of project (wp-plugin or wp-theme).
						updateTimestamp: true,            // Whether the POT-Creation-Date should be updated without other changes.
						updatePoFiles  : false              // Whether to update PO files in the same directory as the POT file.
					}
				}
			},
			// Compile all .less files.
			less  : {
				compile: {
					options: {
						// These paths are searched for @imports
						paths: ['<%= dirs.css %>']
					},
					files  : [{
						'./assets/css/tailwind.css': './assets/css/tailwind.less'
					}]
				}
			},
			cssmin: {
				target: {
					files: [
						{
							expand: true,
							cwd   : 'assets/css/',
							src   : ['*.css', '!*.min.css'],
							dest  : 'assets/css/',
							ext   : '.min.css'
						}
					]
				}
			},
			clean : {
				css  : ['assets/css/*.min.css'],
				init : {
					src: ['build/']
				},
				jsmin: {
					src: [
						'assets/js/*.min.js',
					]
				}
			},
			copy  : {
				build: {
					expand: true,
					src   : [
						'**',
						'!node_modules/**',
						'!build/**',
						'!readme.md',
						'!README.md',
						'!phpcs.ruleset.xml',
						'!package-lock.json',
						'!svn-ignore.txt',
						'!Gruntfile.js',
						'!package.json',
						'!composer.json',
						'!composer.lock',
						'!postcss.config.js',
						'!webpack.config.js',
						'!set_tags.sh',
						'!*.zip',
						'!old/**',
						'!bin/**',
						'!tests/**',
						'!codeception.dist.yml',
						'!regconfig.json',
						'!nbproject/**',
						'!tailwind.config.js',
					],
					dest  : 'build/'
				}
			},

			uglify: {
				options: {
					compress: {
						global_defs: {
							'DEBUG': true
						},
						dead_code  : true
					}
				},
				jsfiles: {
					files: [{
						expand: true,
						cwd   : 'assets/js/',
						src   : [
							'*.js',
							'!*.min.js',
							'!Gruntfile.js',
						],
						dest  : 'assets/js/',
						ext   : '.min.js'
					}]
				}
			},

			compress: {
				build: {
					options: {
						pretty : true,                           // Pretty print file sizes when logging.
						archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
					},
					expand : true,
					cwd    : 'build/',
					src    : ['**/*'],
					dest   : '<%= pkg.name %>/'
				}
			},
			concat  : {
				css: {
					src : [
						'assets/css/dlm-wci.css',
						'assets/css/tailwind.css'
					],
					dest: 'assets/css/front/frontend.css'
				}
			},

		}
	);

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');

	grunt.registerTask('textdomain', [
		'checktextdomain',
		'makepot'
	]);
	grunt.registerTask('minjs', [  // Minify JS
		'clean:jsmin',
		'uglify',
	]);
	grunt.registerTask('mincss', [  // Minify CSS
		'clean:css',
		'cssmin',
	]);

	// Build task
	grunt.registerTask('build-archive', [
		'clean:init',
		'makepot',
		'minjs',
		'build-css',
		'copy',
		'compress:build',
		'clean:init'
	]);

	grunt.registerTask('build-css', [
		'less',
		'concat',
		'cssmin'
	]);
};