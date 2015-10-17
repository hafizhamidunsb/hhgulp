'use strict';

var gulp = require('gulp-help')(require('gulp'));

var rsync = require('gulp-rsync');
var plumber = require('gulp-plumber');

var config = require('./../config.js');
var handleError = require('./../utils/handleError.js');

var ghPages = require('gulp-gh-pages');

var shell = require('gulp-shell');

var cdnify = require('gulp-cdnify');

var file = require('gulp-file');

// Deploying via rsync/sftp
// Credentials are stored in .env file

// TODO plumber not working with this

// gulp.task('deploy', 'Deploy to development enviroment (specified in `.env`)', function() {
//   return gulp.src(config.deploy.src)
//     .pipe(plumber(handleError))
//     .pipe(rsync(config.deploy.dev));
// });
//
// gulp.task('deploy:prod', 'Deploy to production enviroment (specified in `.env`)', function() {
//   return gulp.src(config.deploy.src)
//     .pipe(plumber(handleError))
//     .pipe(rsync(config.deploy.dist));
// });

gulp.task('cdnify', function () {
  if (config.cdnify.enabled) {
    return gulp.src(config.cdnify.src)
      .pipe(cdnify(config.cdnify.cfg))
      .pipe(gulp.dest(config.templates.destBuild));
  }
  else {
    return;
  }
});

gulp.task('ghpages', 'Deploy to Github Pages', function() {
  return gulp.src(config.ghPages.src)
    .pipe(file('CNAME', config.ghPages.cname))
    .pipe(ghPages(config.ghPages.cfg));
});

// divshot is no more...
// gulp.task('divshot', 'Deploy to Divshot', shell.task(['divshot push production']));

gulp.task('deploy', 'Deploy', ['cdnify', 'ghpages']);
