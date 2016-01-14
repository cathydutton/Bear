/*
	Scripts
	----------------------------------- */

	module.exports = function(paths, gulp, plugins) {


		// Version function
		var getStamp = function() {
			var myDate = new Date();
			var myYear = myDate.getFullYear().toString();
			var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
			var myDay = ('0' + myDate.getDate()).slice(-2);
			var myFullDate = myYear + myMonth + myDay;
			return myFullDate;
		};

		// Child modules
		var rename = require('gulp-rename'),
			concat = require('gulp-concat'),
			uglify = require('gulp-uglify'),
			plumber = require('gulp-plumber');

				// Process Sass
				return function() {
					return gulp.src(plugins.path.join(paths.src.js, '*.js'))
					.pipe(plumber())
			    .pipe(concat('main.js'))
					.pipe(gulp.dest(plugins.path.join(paths.build.js, '')))
			    .pipe(rename({ suffix: '-' + getStamp() + '.min' }))
			    .pipe(uglify())
					.pipe(gulp.dest(plugins.path.join(paths.build.js)))
					.pipe(plugins.browserSync.reload({ stream: true }));
				};

	};
