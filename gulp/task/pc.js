var path = require('path');
var WebpackDevServer = require("webpack-dev-server");
var fs = require('fs');

var gulp = require('gulp');
var gutil = require('gulp-util');
var webpack = require('webpack');
var sass = require('gulp-sass');
var rev = require('gulp-rev');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
var minifyCss = require("gulp-minify-css");
var shell = require("gulp-shell");
var replace = require('gulp-replace');
var del = require('del');


gulp.task('pc', ['sass-pc:watch', 'webpack-devServer-pc']);

gulp.task('pc-production', ['pc-replace']);

gulp.task('webpack-pc', function () {
    shell.task([
        "webpack --config webpack.build.js -p"
    ])
});

gulp.task('webpack-devServer-pc', function () {
    shell.task([
        "node node_modules/.bin/webpack-dev-server --inline --port 8081"
    ])
})

// 用webpack生成的带hash的文件替换掉webpack-dev-server的字符
gulp.task('pc-replace', ['clean-view-pc'], function () {
    var replaceBlock = /<!-- build-replace -->([\w\W]*?)<!-- end-build-replace -->/g;
    var replaceContent = /(href|src)=("|')\/pc\/dist\/([\w\W]+?)\2/g;

    var fileHash = {}
    fs.readdirSync('app/public/pc/dist').forEach(function (file) {
        var names = file.split('.')
        // name.hash.ext
        if (names.length == 3) {
            fileHash[names[0] + '.' + names[2]] = names[1]
        }
    });

    return gulp.src(['app/public/pc/src/html/**/*'])
        .pipe(replace(replaceBlock, function (_, m) {
            return m.replace(replaceContent, function (__, m1, m2, m3) {
                if (fileHash[m3]) {
                    var strs = m3.split('.');
                    m3 = strs[0] + '.' + fileHash[m3] + '.' + strs[1]
                    return m1 + '=' + m2 + '/pc/dist/' + m3 + m2
                } else {
                    return __
                }
            })
        }))
        .pipe(gulp.dest('app/views/pc'))
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


// clean
gulp.task('clean-dist-pc', function () {
    return del('app/public/pc/dist/')
})
gulp.task('clean-view-pc', function () {
    return del('app/views/pc/')
})
gulp.task('clean-pc', ['clean-dist-pc', 'clean-view-pc'])
