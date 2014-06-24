// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    open = require('gulp-open'),
    sftp = require('gulp-sftp'),
    gulpLoadPlugins = require('gulp-load-plugins');



// Run git init 
// src is the root folder for git to initialize
gulp.task('init', function(){
  git.init();
});


// Styles
gulp.task('styles', function() {
  return gulp.src('src/sass/style.scss')
    .pipe(sass({ style: 'expanded', }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('build/css'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('build/css'))
    .pipe(livereload());
});

// Scripts
gulp.task('scripts', function() {
  return gulp.src('src/js/**/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'))
    .pipe(concat('main.js'))
    .pipe(gulp.dest('build/js'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(gulp.dest('build/js'))
    .pipe(livereload());
});

// Images
gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest('build/img'))
    .pipe(livereload());
});

// HTML
gulp.task('html', function() {
    return gulp.src("*.html")
        .pipe(gulp.dest(''))
        .pipe(livereload());
})





// Build task
gulp.task('build', function() {
    gulp.start('styles', 'scripts', 'images');
});


// Watch Dev
gulp.task('watch', function() {

  // Watch .scss files
  gulp.watch('src/sass/**/*.scss', ['styles']);

  // Watch .js files
  gulp.watch('src/js/**/*.js', ['scripts']);

  // Watch image files
  gulp.watch('src/img/**/*', ['images']);

  // Watch html files
  gulp.watch('**/*.html', ['html']);

});

gulp.task("url", function(){
  var options = {
    url: "http://bear.dev/",
    // app: "firefox"
  };
  gulp.src("./index.html")
  .pipe(open("", options));
});



gulp.task('deploy', function () {
     // return gulp.src('**/*')
        return gulp.src(['*.html', 'build/styles/**/*.min.css', 'build/scripts/**/*min.js', 'build/images/**/*'])
        .pipe(sftp({ 
            host: 'ftp.cathydutton.co.uk',            
            auth: 'keyMain'
        }));
});



gulp.task('default', [ 'url', 'watch', 'build' ]);


gulp.task('live', ['deploy']);

// Clean Task
gulp.task('clean', function() {
  return gulp.src(['build/styles/', 'build/scripts', 'build/images'], {read: false})
    .pipe(clean());
});

