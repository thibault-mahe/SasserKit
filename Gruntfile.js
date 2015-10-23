module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),


		jshint: {
			files: ['Gruntfile.js', 'assets/js/main.js'],
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
	                'assets/css/main.css': 'assets/css/main.css'
	            }
	        }
	    },

	    csso: {
	          compress: {
	              options: {
	                  report: 'min'
	              },
	              files: {
	                  'assets/css/main.min.css': 'assets/css/main.css'
	              }
	          }
	     },

	    imagemin: {
	      dynamic: {
	        files: [{
	            expand: true,
	            cwd: 'assets/im/',
	            src: ['**/*.{png,jpg,gif}'],
	            dest: 'assets/im/'
	        }]
	      }
	    },

	    sass: {
	      options: {
	        sourceMap: false
	      },
	      dist: {
	        files: {
	          'assets/css/main.css': 'assets/scss/main.scss'
	        }
	      }
	    },

		concat: {
			main: {
				src: ['vendor/jquery/dist/jquery.js',
					'vendor/bootstrap-sass/assets/javascripts/bootstrap.js',
					'assets/js/main.js'],
				dest: 'assets/js/<%= pkg.name %>-<%= pkg.version %>.js'
			},
			ieSupport: {
				src: ['vendor/html5shiv/dist/html5shiv.js',
					'vendor/respond/dest/respond.js'],
				dest: 'assets/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js'
			}
		},

		uglify : {
			js: {
				files: {
					'assets/js/<%= pkg.name %>-<%= pkg.version %>.min.js' : [ 'assets/js/<%= pkg.name %>-<%= pkg.version %>.js' ],
					'assets/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.min.js' : ['assets/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js']
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
			gruntfile: {
		        files: 'Gruntfile.js',
		        tasks: [ 'jshint' ],
		        options: {
		          livereload: false
		        }
		    },
			sass: {
				files: 'assets/scss/main.scss',
				tasks: ['sass', 'autoprefixer', 'csso', 'csscount'],
			},
			script: {
				files: 'assets/js/main.js',
				tasks: ['jshint', 'concat']
			},
			html: {
				files: ['*.html', '*/*.html', '*/*/*.html'],
				tasks: ['sass', 'autoprefixer', 'csso']
			},
			images: {
				files: ['assets/im/**/*.{png,jpg,gif}'],
				tasks: ['imagemin']
			}
		},

		//When the critical css is generated, copy and paste it
		//to insert it in the adequate view.
		criticalcss: {
			home: {
				options:  {
					outputfile : 'assets/css/critical/critical-home.css',
					filename : 'assets/css/main.css',
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
					'assets/css/main.css'
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
