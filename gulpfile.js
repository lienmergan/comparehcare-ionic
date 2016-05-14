var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

/**
 * Custom Gulp Tasks.
 *
 * @author    Olivier Parent
 * @copyright Copyright © 2015-2016 Artevelde University College Ghent
 * @license   Apache License, Version 2.0
 */

// Build the application.
gulp.task('build', ['scripts', 'templates'], build);
function build() {
    console.log(gutil.colors.blue.bgYellow.bold(' App built. '));
}

// Concatenate all scripts to `./www/js/app.js`.
gulp.task('scripts', scripts);
function scripts() {
    return gulp
        .src('./src/**/*.js')
        .pipe(concat('app.js'))
        .pipe(gulp.dest('./www/js'));
}

// Copy all html files to the `./www/templates` folder.
gulp.task('templates', templates);
function templates() {
    sh.rm('-rf', './www/templates'); // Delete folder and all files within.
    return gulp
        .src('./src/**/*.html')
        // .pipe(rename({dirname: ''})) // Remove foldernames from path.
        .pipe(gulp.dest('./www/templates'));
}
