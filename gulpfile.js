/**
 * Created by jinwyp on 7/21/15.
 */

var gulp       = require("gulp");
var requireDir = require('require-dir');

// Specify game project paths for tasks.
global.paths = {
    src: './src',
    out: './bin',

    get scripts() { return this.src + '/**/*.js'; },
    get jsEntry() { return this.src + '/index'; }
};

// Require all tasks in gulp/tasks, including subfolders
var taskObj = requireDir('./gulp/task', { recurse: true });


// console.log(taskObj);

/**
 *  gulp 3.9
 */
// gulp.task('default', gulp.parallel('dev'));
// gulp.task('pro', gulp.parallel('production'));


// gulp.task('ykc', gulp.parallel('mobile-ng-templates', 'dev'));

/**
 *  gulp 4.0
 */
exports.dev = taskObj['server-dev'].dev;
exports.default = taskObj['server-dev'].dev;
exports.pro = taskObj['server-dev'].production;
exports.ykc = gulp.series(taskObj['mobile'].mobileNgTemplates, taskObj['server-dev'].dev);



exports.doc = taskObj['document'].generatedoc;
exports.watchdoc = taskObj['document'].watchdoc;


exports.errcode = taskObj['mobile'].errcode;
exports.delDist = taskObj['mobile'].delDist;
exports.mobileMinifyJs = taskObj['mobile'].mobileMinifyJs;
exports.mobileProduction = taskObj['mobile'].mobileProduction;


exports.pcReplace = taskObj['pc'].pcReplace;
exports.cleanPc = taskObj['pc'].cleanPc;

