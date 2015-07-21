gulp = require "gulp"

# borrow from rdash start
usemin = require("gulp-usemin")
wrap = require("gulp-wrap")
watch = require("gulp-watch")
minifyCss = require("gulp-minify-css")
minifyJs = require("gulp-uglify")
concat = require("gulp-concat")
less = require("gulp-less")
rename = require("gulp-rename")
minifyHTML = require("gulp-minify-html")

paths =
  admincripts: "public/admin/src/js/**/*.*"
  styles: "public/admin/src/less/**/*.*"
  images: "public/admin/src/img/**/*.*"
  templates: "public/admin/src/templates/**/*.html"
  adminIndex: "public/admin/src/index.html"
  adminDist: "public/admin/dist/"
  bower_fonts: "public/components/**/*.{ttf,woff,eof,svg}"


###
Handle bower components from index
###
gulp.task "usemin", ->
  gulp.src(paths.index).pipe(usemin(
    js: [ minifyJs(), "concat" ]
    css: [ minifyCss(keepSpecialComments: 0), "concat" ]
  )).pipe gulp.dest("dist/")


###
Copy assets
###
gulp.task "build-assets", [ "copy-bower_fonts" ]
gulp.task "copy-bower_fonts", ->
  gulp.src(paths.bower_fonts).pipe(rename(dirname: "/fonts")).pipe gulp.dest("dist/lib")


###
Handle custom files
###
gulp.task "build-custom", [ "custom-images", "custom-js", "custom-less", "custom-templates" ]
gulp.task "custom-images", ->
  gulp.src(paths.images).pipe gulp.dest("dist/img")

gulp.task "custom-js", ->
  gulp.src(paths.scripts).pipe(minifyJs()).pipe(concat("dashboard.min.js")).pipe gulp.dest("dist/js")

gulp.task "custom-less", ->
  gulp.src(paths.styles).pipe(less()).pipe gulp.dest("dist/css")

gulp.task "custom-templates", ->
  gulp.src(paths.templates).pipe(minifyHTML()).pipe gulp.dest("dist/templates")
# borrow from rdash end







###
Gulp tasks
###
gulp.task "build", [ "usemin", "build-assets", "build-custom" ]
# borrow from rdash end

