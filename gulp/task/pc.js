var path = require('path');

var gulp = require('gulp');
var env = require('gulp-env');
var gutil = require('gulp-util');
var webpack = require('webpack');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('pc', ['set-env-develop', 'sass-pc', 'webpack-pc']);

gulp.task('pc-production', ['set-env-production', 'sass-pc', 'webpack-pc']);

gulp.task('set-env-develop', function () {
    return env({
        vars: {NODE_ENV: 'development', BUILD_DEV: 'true'}
    })
});

gulp.task('set-env-production', function () {
    return env({
        vars: {NODE_ENV: 'production', BUILD_DEV: 'false'}
    })
});

gulp.task('webpack-pc', function (cb) {
    var called = false;
    webpack(require('./webpack.config.js')).watch({}, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());
        if (!called) {
            called = true;
            cb();
        }
    })
});

gulp.task('sass-pc', function () {
    var buildDir = 'app/public/dist/css/';
    var buildOption = {
        outputStyle: 'compressed'
    };
    if (process.env.BUILD_DEV != 'false') {
        buildDir = 'app/public/src/css';
    }
    return gulp.src('app/public/src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(buildOption).on('error', sass.logError))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(buildDir));
});

gulp.task('sass-pc:watch', function () {
    gulp.watch('app/public/src/sass/**/*.scss', ['sass-pc'])
});
