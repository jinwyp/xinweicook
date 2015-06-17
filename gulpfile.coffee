gulp = require "gulp"
shell = require "gulp-shell"






gulp.task "doc", shell.task([
  "cd doc; ../node_modules/.bin/gitbook build"
], ignoreErrors: false)


gulp.task "watchdoc",  ->
  gulp.watch ["doc/**/*.md"], ["doc"]


gulp.task "nodemon", shell.task([
  "nodemon index.coffee"
], ignoreErrors: false)




gulp.task "doc", [
  "watchdoc"
]


gulp.task "default", [
  "nodemon"
]
