gulp = require "gulp"
shell = require "gulp-shell"






gulp.task "generatedoc", shell.task([
  "cd doc; ../node_modules/.bin/gitbook build"
], ignoreErrors: false)


gulp.task "watchdoc",  ->
  gulp.watch ["doc/**/*.md"], ["generatedoc"]


gulp.task "nodemon", shell.task([
  "nodemon index.coffee"
], ignoreErrors: false)




gulp.task "doc", [
  "generatedoc", "watchdoc"
]


gulp.task "default", [
  "nodemon"
]
