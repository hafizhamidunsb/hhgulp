'use strict';

var gulp = require('gulp-help')(require('gulp'));

var config = require('./../config.js');
var reload = require('./browserSync.js').reload;

// Watch source files

gulp.task('templates-watch', ['templates'], reload);
gulp.task('wiredep-watch', ['wiredep'], reload);
gulp.task('scripts-watch', ['scripts'], reload);

gulp.task('watch', 'Watch source files', function () {
  gulp.watch(config.watch.styles, ['styles']);
  gulp.watch(config.watch.jade, ['templates-watch']);
  gulp.watch(config.watch.wiredep, ['wiredep-watch']);
  gulp.watch(config.watch.scripts, ['scripts-watch']);
});
