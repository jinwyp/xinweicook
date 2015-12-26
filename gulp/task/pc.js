var path = require('path');

var gulp = require('gulp');
var env = require('gulp-env');
var gutil = require('gulp-util');
var webpack = require('webpack');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

gulp.task('pc', ['set-env-develop', 'sass-pc', 'webpack-pc']);

gulp.task('pc-production', ['set-env-production', 'sass-pc', 'copy-images', 'webpack-pc']);

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
    webpack(require(path.join(__dirname, '../../webpack.config.js'))).watch({}, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());
        if (!called) {
            called = true;
            cb();
        }
    })
});

gulp.task('sass-pc', function () {
    var buildDir = 'app/public/pc/dist/css/';
    var buildOption = {
        outputStyle:  'compressed'
    };
    if (process.env.BUILD_DEV != 'false') {
        buildDir = 'app/public/pc/src/css';
        buildOption.outputStyle = 'nested';
    }
    return gulp.src('app/public/pc/src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(buildOption).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 3 versions', '> 3% in CN']}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(buildDir));
});

gulp.task('sass-pc:watch', function () {
    gulp.watch('app/public/pc/src/sass/*.scss', ['sass-pc'])
});

gulp.task('copy-images', function () {
    return gulp.src('app/public/pc/src/images/**/*.*')
        .pipe(gulp.dest('app/public/pc/dist/images/'))
});
