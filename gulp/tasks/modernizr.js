'use strict';

var gulp = require('gulp-help')(require('gulp'));
var modernizr = require('gulp-modernizr');

var config = require('./../config.js');

// Lean Modernizr build

gulp.task('modernizr', 'Create modernizr lean build', function () {
  if (config.modernizr.enabled) {
    return gulp.src(config.modernizr.src)
      .pipe(modernizr(config.modernizr.cfg))
      .pipe(gulp.dest(config.modernizr.dest));
  }
  else {
    return;
  }
});
