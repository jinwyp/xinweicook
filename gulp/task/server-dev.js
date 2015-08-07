/**
 * Created by jinwyp on 7/21/15.
 */


var gulp  = require("gulp");
var shell = require("gulp-shell");




gulp.task("devjin",
    shell.task([
        "nodemon index.coffee"
    ], {ignoreErrors: false})
);

gulp.task("devykc",
    shell.task([
        "nodemon index.coffee"
    ], {ignoreErrors: false})
);


