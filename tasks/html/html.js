/*
	HTML INCLUDES
	----------------------------------- */

	module.exports = function(paths, gulp, plugins) {

		// Child modules
		var fileinclude = require('gulp-file-include');

		// Return module
		return function() {

			return gulp.src(plugins.path.join(paths.source, '/**/*.html'))

				// File Include
				.pipe(fileinclude({
	      	prefix: '@@',
	      	basepath: '@file'
	    	}))

				.pipe(gulp.dest(plugins.path.join(paths.dist)))
				.pipe(plugins.browserSync.reload({ stream: true }));
			};

		};
