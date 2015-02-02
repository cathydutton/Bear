// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    open = require("gulp-open"),
    scsslint = require('gulp-scss-lint');



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
    .pipe(concat('scripts.js'))
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
    gulp.start('styles', 'scripts', 'images', 'html');
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


// Open task
gulp.task("open", function(){
  var options = {
    // url: "http://project.dev/",
  };
  gulp.src("./index.html")
  .pipe(open("", options));
});

// Lint

gulp.task('lint', function() {
  gulp.src('src/sass/**/*.scss')
    .pipe(scsslint());
});



/* TASKS
========================================================================== */


// Default task
gulp.task('default', [ 'open', 'watch', 'build' ]);


// Clean Task
gulp.task('clean', function() {
  return gulp.src(['build/css/', 'build/js', 'build/ig'], {read: false})
    .pipe(clean());
});

