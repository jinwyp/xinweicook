var fs = require('fs');
var path = require('path');

var gulp = require('gulp');
var replace = require('gulp-replace');
var del = require('del');

// 用webpack生成的带hash的文件替换掉webpack-dev-server的字符
gulp.task('pc-replace', ['clean-view-pc'], function () {
    var replaceBlock = /<!-- build-replace -->([\w\W]*?)<!-- end-build-replace -->/g;
    var replaceContent = /(href|src)=("|')\/pc\/dist\/([\w\W]+?)\2/g;

    var fileHash = {}
    fs.readdirSync('dist').forEach(function (file) {
        var names = file.split('.')
        // name.hash.ext
        if (names.length == 3) {
            fileHash[names[0] + '.' + names[2]] = names[1]
        }
    });

    return gulp.src(['src/html/**/*'])
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
        .pipe(gulp.dest('../../views/pc'))
})


// clean
gulp.task('clean-dist-pc', function () {
    return del('dist/')
})
gulp.task('clean-view-pc', function () {
    return del('../../views/pc/', {force: true})
})
gulp.task('clean-pc', ['clean-dist-pc', 'clean-view-pc'])
