module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),


		jshint: {
			files: ['Gruntfile.js', 'js/main.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},

		autoprefixer: {
	        dist: {
	            options: {
	              browsers: ['last 2 version', 'ie 9', 'Firefox > 20', 'Safari > 5'],
	              flatten: true
	            },
	            files: {
	                'css/main.css': 'css/main.css'
	            }
	        }
	    },

	    csso: {
	          compress: {
	              options: {
	                  report: 'min'
	              },
	              files: {
	                  'css/main.min.css': 'css/main.css'
	              }
	          }
	     },

	    imagemin: {
	      dynamic: {
	        files: [{
	            expand: true,
	            cwd: 'im/',
	            src: ['**/*.{png,jpg,gif}'],
	            dest: 'im/'
	        }]
	      }
	    },

	    sass: {
	      options: {
	        sourceMap: false
	      },
	      dist: {
	        files: {
	          'css/main.css': 'scss/main.scss'
	        }
	      }
	    },

		concat: {
			main: {
				src: ['vendor/jquery/dist/jquery.js',
					'vendor/bootstrap-sass/assets/javascripts/bootstrap.js',
					'js/*.js'],
				dest: 'js/<%= pkg.name %>-<%= pkg.version %>.js'
			},
			ieSupport: {
				src: ['vendor/html5shiv/dist/html5shiv.js',
					'vendor/respond/dest/respond.js'],
				dest: 'dist/<%= pkg.name %>-<%= pkg.version %>-ie-support.js'
			}
		},

		uglify : {
			js: {
				files: {
					'dist/<%= pkg.name %>-<%= pkg.version %>.js' : [ 'dist/<%= pkg.name %>-<%= pkg.version %>.js' ],
					'dist/<%= pkg.name %>-<%= pkg.version %>-ie-support.js' : ['dist/<%= pkg.name %>-<%= pkg.version %>-ie-support.js']
				}
			}
		},

		connect: {
			localhost: {
				options: {
					port: 9001,
					open: {
						target: 'http://localhost:9001/'
					},
					keepalive: false,
					base: [''],
					livereload: false,
					hostname: 'localhost',
				}
			}
		},

		delta: {
			options: {
				livereload: true,
			},
			sass: {
				files: 'scss/*.scss',
				tasks: ['sass', 'autoprefixer', 'csso'],
			},
			script: {
				files: 'js/*.js',
				tasks: ['jshint', 'concat']
			},
			html: {
				files: ['index.html'],
				tasks: ['sass', 'autoprefixer', 'csso']
			}
		},

		//When the critical css is generated, copy and paste it
		//to insert it in the adequate view.
		criticalcss: {
			home: {
				options:  {
					outputfile : 'css/critical/critical-home.css',
					filename : 'css/main.css',
					url : 'http://localhost:9001',
					width: 1200,
                	height: 900
				}
			}
			// view: {
			// 	options:  {
			// 		outputfile : 'css/critical/critical-viewName.css',
			// 		filename : 'css/main.css',
			// 		url : 'path/to/view.html'
			// 	}
			// }
		},

		pagespeed: {
			options: {
				nokey: true,
				url: "" //insert url here
			},
			prod: {
				options: {
					url: "", //insert url here
					locale: "en_GB",
					strategy: "desktop",
					threshold: 80
				}
			},
			paths: {
				options: {
					paths: [], //insert paths here
					locale: "en_GB",
					strategy: "desktop",
					threshold: 80
				}
			}
		},

		csscount: {
			dev: {
				src: [
					'css/main.css'
				],
				options: {
					maxSelectors: 4095,
					maxSelectorDepth: false
				}
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-csso');
	grunt.loadNpmTasks('grunt-sass');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-criticalcss');
	grunt.loadNpmTasks('grunt-pagespeed');
	grunt.loadNpmTasks('grunt-css-count');

	grunt.registerTask('images', ['imagemin']);
	grunt.registerTask('critical', ['criticalcss']);
	grunt.registerTask('stats', ['csscount', 'pagespeed']);
	grunt.renameTask( 'watch', 'delta' );
	grunt.registerTask('default', [
		'jshint',
		'sass',
		'autoprefixer',
		'csscount',
		'csso',
		'concat',
		'uglify',
		'imagemin',
		'connect:localhost',
		'criticalcss',
		'delta'
	]);

};
