/**
 * Created by jinwyp on 7/21/15.
 */

var gulp  = require("gulp");
var shell = require("gulp-shell");



function generatedoc () {
    shell.task(["cd doc; gitbook build"], {ignoreErrors: false})
}

exports.generatedoc = generatedoc;

function watchdoc () {
    gulp.watch( ["doc/**/*.md"], generatedoc )
}

exports.watchdoc = watchdoc;


// gulp.task( "doc", ["generatedoc"]);

