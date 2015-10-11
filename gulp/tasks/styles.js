'use strict';

var gulp = require('gulp-help')(require('gulp'));

var sass = require('gulp-sass');

var sourcemaps = require('gulp-sourcemaps');
var postcss = require('gulp-postcss');
var plumber = require('gulp-plumber');

var autoprefixer = require('autoprefixer');

var config = require('./../config.js');
var browserSync = require('./browserSync.js');
var handleError = require('./../utils/handleError.js');

// Complie scss using libsass

gulp.task('styles', 'Compile Sass to CSS', function () {
  return gulp.src(config.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass(config.styles.sassCfg))
    .on('error', handleError)
    .pipe(postcss([
      autoprefixer(config.styles.autoprefixerCfg)
    ]))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(config.styles.dest))
    .pipe(browserSync.reload({stream:true}));
});
