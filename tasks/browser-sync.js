/*
	BrowserSync
	----------------------------------- */

	module.exports = function(paths, gulp, plugins) {

		// Return module
		return function() {

			var options = {
				browser: 'google chrome',
				notify: false,
				server: { baseDir: paths.dist }
			};

			return plugins.browserSync(options);
		};
	};
