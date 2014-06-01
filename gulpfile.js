var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');
var size = require('gulp-size');
var shell = require('gulp-shell');

gulp.task('footprint', function() {
   return browserify('./src/index', {list: true})
      .bundle()
      .pipe(source('bundle.js'))
      .pipe(streamify(uglify()))
      .pipe(streamify(size()))
      .pipe(shell([
        'browserify-graph src/index.js'
      ]));
});
