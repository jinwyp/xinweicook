var gulp = require('gulp'),
    minifyHtml = require("gulp-minify-html"),
    ngTemplateCache = require('gulp-angular-templatecache');

gulp.task('mobile-ng-templates', function () {
    return gulp.src('app/public/mobile/src/js/directives/*.html')
        .pipe(minifyHtml({empty: true, quotes: true}))
        .pipe(ngTemplateCache('templates.js', { module:'xw.directives'}))
        .pipe(gulp.dest('app/public/mobile/src/js/'));
});