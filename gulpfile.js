/*
	Dependencies
	----------------------------------- */

	// Gulp + plugins
	var gulp = require('gulp'),
		plugins = require('gulp-load-plugins')();

	// Non-gulp modules
	plugins.path = require('path');
	plugins.browserSync = require('browser-sync'),
	plugins.runSequence = require('run-sequence');
	plugins.eventStream = require('event-stream');

	// Shared paths
	var paths = {

		// Build paths
		base: __dirname,
		dist: plugins.path.join(__dirname, 'dist'),
		source: plugins.path.join(__dirname, 'src'),
		tasks: plugins.path.join(__dirname, 'tasks'),

		// Src assets
		src: {
			scss: plugins.path.join(__dirname, 'src/assets/scss'),
			js: plugins.path.join(__dirname, 'src/assets/js'),
			images: plugins.path.join(__dirname, 'src/assets/img')
		},

		// Build assets
		build: {
			css: plugins.path.join(__dirname, 'dist/assets/css'),
			js: plugins.path.join(__dirname, 'dist/assets/js'),
			images: plugins.path.join(__dirname, 'dist/assets/img')
		},

		// Node modules
		modules: plugins.path.join(__dirname, 'node_modules')
	};


/*
	Child tasks
	----------------------------------- */

	plugins.getModule = function(task) {
		return require(plugins.path.join(paths.tasks, task))(paths, gulp, plugins);
	}

	gulp.task('critical-css', plugins.getModule('css/critical'));
	gulp.task('main-css', plugins.getModule('css/main'));
	gulp.task('scripts', plugins.getModule('javascript/scripts'));
	gulp.task('html', plugins.getModule('html/html'));
	gulp.task('inject', plugins.getModule('html/inject'));
	gulp.task('image-optimise', plugins.getModule('images/optimise'));
	gulp.task('watch', plugins.getModule('watch'));
	gulp.task('browser-sync', plugins.getModule('browser-sync'));

/*
	Utility tasks
	----------------------------------- */

	// Clean build directory
	var clean = require('gulp-clean');

	gulp.task('clean', function() {
		return gulp.src(plugins.path.join(paths.dist))
	    .pipe(clean());
	});


	// Sass Lint
  var scsslint = require('gulp-scss-lint'),
  plumber = require('gulp-plumber');

  gulp.task('scss-lint', function() {
		return gulp.src(plugins.path.join(paths.src.scss, '/**/*.scss'))
    .pipe(plumber())
    .pipe(scsslint({
      'config': 'default.yml',
      'reporterOutput': 'scssReport.json',
    }))
    //.pipe(scsslint.failReporter()) // Fail on warnings & errors
    .pipe(scsslint.failReporter('E')) // Fail on set errors
    // .on('error', function (err) {
    //       console.log(err);
    //       process.exit(1);
    // })
  });


	// CSS Lint
	var csslint = require('gulp-csslint')

  gulp.task('css-lint', function() {
    return gulp.src(plugins.path.join(paths.build.css, '*.css'))
      .pipe(csslint({
        'config': '.csslintrc',
        'shorthand': false
      }))
      .pipe(csslint.reporter());
  });gulp

	// Style stats
	var stylestats = require('gulp-stylestats');

	gulp.task('stylestats', function () {
	  return gulp.src(plugins.path.join(paths.build.css, '*.css'))
	    .pipe(stylestats({
	      type: 'json',
	      outfile: true
	    }))
	    .pipe(gulp.dest('./stats/'));
	});

/*
	Main tasks
	----------------------------------i- */

	// Shared build tasks
	gulp.task('build', ['clean'] ,function(callback) {
		plugins.runSequence('html','critical-css', 'main-css', 'scripts', 'image-optimise', 'inject', callback);
	});

	// Default tasks
	gulp.task('default', ['clean'] , function(callback) {
		plugins.runSequence('build', callback);
	});

	// Development tasks
	gulp.task('dev', function(callback) {
		plugins.runSequence('build', ['watch', 'browser-sync'], callback);
	});

	// Live tasks
	gulp.task('live', function(callback) {
		plugins.runSequence('build', callback);
		gulp.start('css-lint', callback);
		gulp.start('stylestats', callback);
	});
