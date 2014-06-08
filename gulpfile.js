'use strict';

var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var shell = require('gulp-shell');
var jshint = require('gulp-jshint');

function lint() {
  var files = ['src/**/*.js', 'test/**/*.js', 'gulpfile.js', 'karma.conf.js'];
  return gulp.src(files)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
}

function browserspec() {
  return gulp.src('')
    .pipe(shell(['karma start']));
}

function nodespec() {
  return gulp.src('')
    .pipe(shell(['mocha test/node-spec -R spec']));
}

gulp.task('footprint', function() {
   return browserify('./src/index', {list: true})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(streamify(uglify()))
      .pipe(streamify(size()))
      .pipe(shell(
        'browserify-graph src/index.js'
      ));
});

gulp.task('browserspec', function() {
  return browserspec();
});

gulp.task('nodespec_noext', function() {
  return nodespec();
});

gulp.task('nodespec', function() {
  return nodespec();
});

gulp.task('lint', function() {
  return lint();
});

gulp.task('watch', function() {
  var files = ['src/**/*.js', 'test/**/*.js'];
  var tasks = ['lint', 'browserspec', 'nodespec'];

  gulp.watch(files, tasks);
});
