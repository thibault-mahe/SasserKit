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
	        sourceMap: true
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
				dest: 'js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js'
			}
		},

		uglify : {
			js: {
				files: {
					'js/<%= pkg.name %>-<%= pkg.version %>.js' : [ 'js/<%= pkg.name %>-<%= pkg.version %>.js' ],
					'js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js' : ['js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js']
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
				tasks: []
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

	grunt.registerTask('images', ['imagemin']);
	grunt.registerTask('prod', ['jshint', 'sass', 'autoprefixer', 'csso', 'concat', 'uglify:js', 'imagemin']);
	grunt.renameTask( 'watch', 'delta' );
	grunt.registerTask('default', ['jshint', 'sass', 'autoprefixer', 'csso', 'concat', 'connect:localhost', 'delta']);

};
