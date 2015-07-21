/**
 * Created by jinwyp on 7/21/15.
 */

var gulp  = require("gulp");
var shell = require("gulp-shell");



gulp.task( "generatedoc" ,
    shell.task([
        "cd doc; gitbook build"
    ], {ignoreErrors: false})
);


gulp.task( "watchdoc", function(){
    gulp.watch( ["doc/**/*.md"], ["generatedoc"] )
});



gulp.task( "doc", ["generatedoc"]);


