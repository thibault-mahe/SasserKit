module.exports = function(grunt) {

require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		//Gruntfile var

		vendorsPath : './vendor',
		srcAssets : './_assets',
		buildAssets : './assets',
		pkg: grunt.file.readJSON('package.json'),

		//Tasks for JavaScript

		eslint: {
			options: {
				useEslintrc: true,
			},
			target: ['<%= srcAssets %>/js/main.js']
		},

		browserify: {
			dist: {
				options: {
					transform: [["babelify"]]
				},
				files: {
					"<%= srcAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.js": "<%= srcAssets %>/js/main.js"
				}
			}
		},

		concat: {
			main: {
				src: ['<%= vendorPath %>/jquery/dist/jquery.js',
				'<%= vendorPath %>/bootstrap-sass/assets/javascripts/bootstrap.js',
				'<%= srcAssets %>/js/main.js'],
				dest: '<%= srcAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.js'
			},
			ieSupport: {
				src: ['<%= vendorPath %>/html5shiv/dist/html5shiv.js',
				'<%= vendorPath %>/respond/dest/respond.js'],
				dest: '<%= srcAssets %>/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js'
			}
		},

		uglify : {
			js: {
				files: {
					'<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js' : [ '<%= srcAssets %>/js/<%= pkg.name %>-<%= pkg.version %>.js' ],
					'<%= buildAssets %>/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.min.js' : ['<%= srcAssets %>/js/<%= pkg.name %>-<%= pkg.version %>-ie-support.js']
				}
			}
		},

		//Tasks for CSS

		postcss: {
			options: {
				map: true,
				processors: [
				require('autoprefixer')({browsers: ['last 2 versions']})
				]
			},
			dist: {
				options: {
					browsers: ['last 2 version', 'ie 9', 'Firefox > 20', 'Safari > 5'],
					flatten: true
				},
				files: {
					'<%= srcAssets %>/css/main.css' : ['<%= srcAssets %>/css/main.css'],
				}
			}
		},

		csso: {
			compress: {
				options: {
					report: 'min'
				},
				files: {
					'<%= buildAssets %>/css/main.min.css': '<%= srcAssets %>/css/main.css'
				}
			}
		},

		sass: {
			options: {
				sourceMap: false
			},
			dist: {
				files: {
					'<%= srcAssets %>/css/main.css': '<%= srcAssets %>/scss/main.scss'
				}
			}
		},

	    //When the critical css is generated, copy and paste it
		//to insert it in the adequate view.
		criticalcss: {
			home: {
				options:  {
					outputfile : '<%= srcAssets %>/css/critical/critical-home.css',
					filename : '<%= srcAssets %>/css/main.css',
					url : 'http://localhost:9001',
					width: 1200,
					height: 900
				}
			}
		},

	    //Tasks for images and fonts

	    imagemin: {
	    	dynamic: {
	    		files: [{
	    			expand: true,
	    			cwd: '<%= srcAssets %>/im/',
	    			src: ['**/*.{png,jpg,gif}'],
	    			dest: '<%= buildAssets %>/im/'
	    		}]
	    	}
	    },

	    copy: {
	    	main: {
	    		files: [
	    		{expand: true, cwd: '<%= srcAssets %>/', src: ['fonts/**'], dest: '<%= buildAssets %>'},
	    		],
	    	},
	    },

	    //Tasks for livereload

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
	    		tasks: [ 'eslint' ],
	    		options: {
	    			livereload: false
	    		}
	    	},
	    	sass: {
	    		files: '<%= srcAssets %>/scss/main.scss',
	    		tasks: ['sass', 'postcss', 'csso', 'csscount'],
	    	},
	    	script: {
	    		files: '<%= srcAssets %>/js/main.js',
	    		tasks: ['eslint', 'browserify', 'concat']
	    	},
	    	html: {
	    		files: ['*.html', '*/*.html', '*/*/*.html'],
	    		tasks: ['sass', 'postcss', 'csso']
	    	},
	    	images: {
	    		files: ['<%= srcAssets %>/im/**/*.{png,jpg,gif}'],
	    		tasks: ['imagemin']
	    	}
	    },

		//Tasks for stats

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
				'<%= buildAssets %>/css/main.css'
				],
				options: {
					maxSelectors: 4095,
					maxSelectorDepth: false
				}
			}
		},

		concurrent: {
			transform: ['browserify', 'sass'],
			minify: ['csso', 'uglify'],
			optim: ['imagemin', 'criticalcss']
		}

	});

grunt.registerTask('images', ['imagemin']);
grunt.registerTask('critical', ['criticalcss']);
grunt.registerTask('stats', ['csscount', 'pagespeed']);
grunt.renameTask( 'watch', 'delta' );
grunt.registerTask('default', [
	'eslint',
	'concurrent:transform',
	'postcss',
	'csscount',
	'concat',
	'concurrent:minify',
	'connect:localhost',
	'copy',
	'delta'
	]);
grunt.registerTask('prod', [
	'eslint',
	'concurrent:transform',
	'postcss',
	'csscount',
	'concat',
	'concurrent:minify',
	'copy',
	'concurrent:optim'
	]);

};
