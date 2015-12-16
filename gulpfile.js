/**
 * GULP
 *
 * TASKS
 * 
 * - default 
 * 		--> watches and lints all js files
 * 		--> converts jsx - js and puts relevant files in dist folder
 * 
 * - production
 * 		--> tests code
 * 		--> builds, concats, minifies
 * 		--> sets index.html script to minified source
 *
 * - test
 * 		--> runs unit and integration tests
 * 		
 * - test-coverage
 * 		--> runs unit and integration tests
 * 		--> gives coverage istanbul report
 */

var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var jshint = require('gulp-jshint');
var mocha = require('gulp-mocha');
var istanbul = require('gulp-istanbul');
var util = require('gulp-util');

// Set up directories
var path = {
  html: 'public/index.html',
  min: 'build.min.js',
  out: 'build.js',
  dest: 'dist',
  dest_build: 'dist/build',
  dest_src: 'dist/src',
  entry: 'public/main.js',
  js: ['app/**/*.js', 'test/**/*.js', 'dist/public/src/build.js', '!app/aws/node_modules/**/*.js']
};

// Default
gulp.task('default', ['watch', 'copy']);
// Production
gulp.task('production', ['test', 'replaceHtml', 'build']);

// Copies index.html to the dist folder
gulp.task('copy', function() {
  gulp.src(path.html)
    .pipe(gulp.dest(path.dest));
});

// Watches
gulp.task('watch', function() {
  // Copy index.html on any changes
  gulp.watch(path.html, ['copy']);
  // Watch all .js files for linting
  gulp.watch(path.js, ['lint']);

  // Browserify
  // Changes jsx --> js
  // Works browserify magic
  var watcher = watchify(browserify({
    entries: [path.entry],
    transform: [reactify],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  // Concat js files and pipe code to the dest folder
  return watcher.on('update', function() {
      watcher.bundle()
        .pipe(source(path.out))
        .pipe(gulp.dest(path.dest_src));
      console.log('updated');
    })
    .bundle()
    .pipe(source(path.out))
    .pipe(gulp.dest(path.dest_src));
});

// Production build
// Concats, converts jsx-js, browserfies, and minifies
gulp.task('build', function() {
  browserify({
      entries: [path.entry],
      transform: [reactify]
    })
    .bundle()
    .pipe(source(path.min))
    .pipe(streamify(uglify(path.min)))
    .pipe(gulp.dest(path.dest_build));
});

// Replaces script source in index.html to minified source from dest/build
gulp.task('replaceHtml', function() {
  gulp.src(path.html)
    .pipe(htmlreplace({
      'js': 'build/' + path.min
    }))
    .pipe(gulp.dest(path.dest));
});

// Sets up istanbul
gulp.task('pre-test', function() {
  return gulp.src(['app/*.js', 'app/models/*.js', 'app/controllers/*.js', 'app/aws/*.js'])
    .pipe(istanbul().on('error', util.log))
    .pipe(istanbul.hookRequire());
});

// Runs tests and outputs istanbul coverage report
gulp.task('test-coverage', ['pre-test'], function() {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha())
    .pipe(istanbul.writeReports())
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

// Runs unit and integration tests
gulp.task('test', function() {
  return gulp.src(['test/**/*.js'])
    .pipe(mocha())
    .once('error', function() {
      process.exit(1);
    })
    .once('end', function() {
      process.exit();
    });
});

// Lints js files
gulp.task('lint', function() {
  return gulp.src(['app/**/*.js', 'test/**/*.js', 'dist/public/src/build.js', '!app/aws/node_modules/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});
