/*
	HTML INJECT
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
		var htmlmin = require('gulp-html-minifier'),
				replace = require('gulp-replace'),
				inject = require('gulp-inject');

		// Return module
		return function() {

		  return gulp.src('dist/*.html')


			// Inline CSS
			.pipe(inject(gulp.src(plugins.path.join(paths.build.css, 'critical.min.css')), {
			starttag: '<!-- inject:{{ext}} -->',
			 transform: function (filePath, file) {
					return '<style>' + file.contents.toString('utf8') + '</style>'
			 }
			}))

			// Cache Bust
			.pipe(replace('@@cacheBust', getStamp()))
			.pipe(gulp.dest(plugins.path.join(paths.dist)))
			.pipe(plugins.browserSync.reload({ stream: true }));
		};
	};
