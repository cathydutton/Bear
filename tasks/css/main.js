/*
	CSS
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
			minifycss = require('gulp-minify-css'),
			postcss = require('gulp-postcss'),
			autoprefixer = require('autoprefixer-core'),
			mqpacker = require('css-mqpacker'),
			csswring = require('csswring'),
			plumber = require('gulp-plumber');

				// Process Sass
				return function() {

					var processors = [
						autoprefixer({
						browsers: ['> 2%', 'IE >= 8', 'iOS >= 7'],
						cascade: false,
						map: true,
						remove: true
					}),
						mqpacker,
						csswring ({
							removeAllComments: true
						}),
					];

					return gulp.src(plugins.path.join(paths.src.scss, '/main.scss'))
					.pipe(plumber())
					.pipe(plugins.sass({ style: 'expanded', }))
					.pipe(postcss(processors))
					.pipe(minifycss())
					.pipe(rename({ suffix: '-' + getStamp() + '.min'}))
					.pipe(gulp.dest(plugins.path.join(paths.build.css)))
					.pipe(plugins.filter('**/*.css'))
					.pipe(plugins.browserSync.reload({ stream: true }));
				};

	};
