/**
 * Created by jinwyp on 7/21/15.
 */


var gulp    = require("gulp");
var shell   = require("gulp-shell");
var nodemon = require('gulp-nodemon');


// nodemon 的配置
var nodemonConfig = {
    "watch": [
        "app"
    ],
    script : 'index.coffee',
    ext: 'coffee js json',
    ignore : [
        ".git",
        "app/tmp/**",
        "app/public/**",
        "app/views/**",
        "node_modules/**"
    ],
    // nodeArgs: ['--debug'],
    env    : {
        "NODE_ENV": "development",
        "LEVEL": "debug"
    }
};




/********************  使用nodemon 自动重启服务器  ********************/
gulp.task('dev', function() {
    return nodemon(nodemonConfig).on('restart', function () {
        console.log('-------------------- Nodejs server restarted! --------------------');
    });
});

gulp.task('production', function() {
    nodemonConfig.env.NODE_ENV = 'production2';
    return nodemon(nodemonConfig).on('restart', function () {
        console.log('-------------------- Nodejs server restarted! --------------------');
    });
});



gulp.task("devold",
    shell.task([ "nodemon index.coffee"], {ignoreErrors: false})
);


