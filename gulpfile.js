var gulp = require('gulp');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var pump = require('pump');
var jshint = require('gulp-jshint');
var babel  = require('gulp-babel');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');


gulp.task('annotate', function () {
    return gulp.src('public/javascripts/*.js')
        .pipe(ngAnnotate())
        .pipe(gulp.dest('public/javascripts/gulp'));
});


gulp.task('compress', function (cb) {
  pump([
        gulp.src('public/javascripts/gulp/*.js'),
        uglify(),
        gulp.dest('public/javascripts/gulp')
    ],
    cb
  );
});


gulp.task('lint', function() {
  return gulp.src('public/javascripts/gulp/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
});


gulp.task('babel', () => {
    return gulp.src('public/javascripts/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('public/javascripts/gulp'));
});


gulp.task('concat', function() {
  return gulp.src(['./public/javascripts/gulp/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('./public/javascripts/gulp'));
});


gulp.task('cssmin', function () {
    gulp.src('./public/stylesheets/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/stylesheets/gulp'));
});
