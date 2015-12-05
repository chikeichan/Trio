// Include gulp
var gulp = require('gulp'); 
var Server = require('karma').Server;

// Include Our Plugins
var jshint       = require('gulp-jshint');
var concat       = require('gulp-concat');
var uglify       = require('gulp-uglify');
var rename       = require('gulp-rename');
var wrap         = require('gulp-wrap');
var strip        = require('gulp-strip-debug');
var environments = require('gulp-environments');
var sourcemaps   = require('gulp-sourcemaps');
var coveralls = require('gulp-coveralls');

// Set up environments
var development  = environments.development;
var production   = environments.production;

var buildSrc = [
    'src/polyfills/*.js',
    'src/init/*.js',
    'src/helpers/*.js',
    'src/signal/*.js',
    'src/module/*.js',
    'src/resource/*.js',
    'src/factory/*.js',
    'src/service/*.js',
    'src/stylizer/*.js',
    'src/renderer/*.js',
    'src/component/*.js',
    'src/index.js'
];

// Lint Task
gulp.task('lint', function() {
    return gulp.src([
            'src/init/*.js',
            'src/helpers/*.js',
            'src/signal/*.js',
            'src/module/*.js',
            'src/resource/*.js',
            'src/factory/*.js',
            'src/service/*.js',
            'src/stylizer/*.js',
            'src/renderer/*.js',
            'src/component/*.js',
            'src/index.js'
        ])
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));
});

gulp.task('scripts', function() {
    if (development()) {
        return devScript();
    }
    return prodSrcipt();
});

/**
 * Run test once and exit
 */
gulp.task('runTest', function (done) {
  new Server({
    configFile: __dirname + '/karma.conf.js'
  }, done).start();
});

/**
 * Run test once and exit
 */
gulp.task('test', ['lint', 'runTest']);

//Coveralls
gulp.task('coveralls', function() {
    gulp.src('coverage/lcov.info')
      .pipe(coveralls());
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('src/*/*.js', ['lint', 'scripts']);
    gulp.watch('src/*.js', ['lint', 'scripts']);
});

// Default Task
gulp.task('default', ['lint', 'scripts']);

// Concatenate & Minify JS
function devScript() {
    return gulp.src(buildSrc)
        .pipe(sourcemaps.init())
            .pipe(concat('trio.js'))
            .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist'))
        .pipe(rename('trio.min.js'))
        .pipe(gulp.dest('dist'));
};

// Concatenate & Minify JS
function prodSrcipt() {
    return gulp.src(buildSrc)
        .pipe(concat('trio.js'))
        .pipe(wrap('(function(){\n"use strict";\n<%= contents %>\n})();'))
        .pipe(strip())
        .pipe(gulp.dest('dist'))
        .pipe(rename('trio.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
};
