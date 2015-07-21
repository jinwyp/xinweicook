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
requireDir('./gulp/task', { recurse: true });






gulp.task('default', ['devjin']);

