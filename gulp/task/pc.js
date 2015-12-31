var path = require('path');

var gulp = require('gulp');
var env = require('gulp-env');
var gutil = require('gulp-util');
var webpack = require('webpack');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var WebpackDevServer = require("webpack-dev-server");
var minifyCss = require("gulp-minify-css");
var shell = require("gulp-shell");
var del = require('del');
var usemin = require('gulp-usemin');


gulp.task('pc', ['sass-pc:watch', 'webpack-devServer-pc']);

gulp.task('pc-production', ['sass-pc', 'webpack-pc']);

gulp.task('webpack-pc', function () {
    var config = require(path.join(__dirname, '../../webpack.config.js'))({
        BUILD: true
    })

    webpack(config, function (err, stats) {
        if (err) throw new gutil.PluginError("webpack", err);
        gutil.log("[webpack]", stats.toString());
    })
});

gulp.task('webpack-devServer-pc', function () {
    shell.task([
        "node node_modules/.bin/webpack-dev-server --inline --port 8081"
    ])
})


// sass
gulp.task('sass-pc', function () {
    return sassBuild()
});
gulp.task('sass-pc:watch', function () {
    return gulp.watch('app/public/pc/src/sass/*.scss', ['sass-pc'])
});
gulp.task('sass-pc-production', function () {
    return sassBuild(true)
});
function sassBuild(production) {
    var buildOption = {
        outputStyle: production ? 'compressed' : 'nested'
    };
    return gulp.src('app/public/pc/src/sass/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass(buildOption).on('error', sass.logError))
        .pipe(autoprefixer({browsers: ['last 3 versions', '> 3% in CN']}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('app/public/pc/src/css/'));
}
gulp.task("hashCss", function () {
    var replaceBlock = /<!-- build-replace-->([\w\W]*?)<!-- end-build-replace-->/g;
    var useminOptions = {
        css: [minifyCss(), rev()]
    };

    return gulp.src('app/public/pc/src/html/includes/css.nunj')
        .pipe(replace(replaceBlock, function (_, m) {
            return '<!-- build-replace-->'
                + m.replace(/\/pc\/src\//g, '')
                + '<!-- end-build-replace-->';
        }))
        .pipe(usemin(useminOptions))
        .pipe(replace(replaceBlock, function (_, m) {
            return m.replace(/\bhref="\.\.(.*?")/g, function (_, m1, m2) {
                return m1 + '="/pc/dist' + m2
            })
        }))
        .pipe(gulp.dest('app/public/pc/dist/html/includes'))
});

// copy
gulp.task('copy-images-pc', function () {
    return gulp.src('app/public/pc/src/images/**/*.*')
        .pipe(gulp.dest('app/public/pc/dist/images/'))
});
gulp.task('copy-html-pc', function () {
    return gulp.src('app/public/pc/dist/html/**/*.*')
        .pipe(gulp.dest('app/views/pc'))
})
gulp.task('copy-pc', ['copy-images', 'copy-html'])


// clean
gulp.task('clean-image-pc', function () {
    return del('app/public/pc/dist/images')
})
gulp.task('clean-css-pc', function () {
    return del('app/public/pc/dist/css')
})
gulp.task('clean-html-pc', function () {
    return del('app/public/pc/dist/html')
})
gulp.task('clean-js-pc', function () {
    return del('app/public/pc/dist/js')
})
gulp.task('clean-view-pc', function () {
    return del('app/views/pc/')
})
gulp.task('clean-pc', ['clean-image-pc', 'clean-css-pc',
    'clean-html-pc', 'clean-js-pc', 'clean-view-pc'])
