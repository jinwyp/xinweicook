gulp = require "gulp"
shell = require "gulp-shell"

gulp.task "doc", shell.task([
  "cd doc; ../node_modules/.bin/gitbook build"
], ignoreErrors: false)

gulp.task "watch",  ->
  gulp.watch ["doc/**/*.md"], ["doc"]

gulp.task "default", [
  "watch"
]
