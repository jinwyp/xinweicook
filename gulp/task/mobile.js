var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var minifyHtml = require("gulp-minify-html");
var ngTemplateCache = require('gulp-angular-templatecache');



var paths = {
    baseStatic : 'app/public/',
    baseView : 'app/views/',

    sourceMobile : {
        root : 'mobile/src',
        js : 'mobile/src/js/**',
        html : 'mobile/src/html/**'
    },

    distMobile : {
        root : 'mobile/dist',
        js : 'mobile/dist/js',
        html : 'mobile'
    }
};


gulp.task('mobile-ng-templates', function () {
    return gulp.src('app/public/mobile/src/js/directives/*.html')
        .pipe(minifyHtml({empty: true, quotes: true}))
        .pipe(ngTemplateCache('templates.js', { module:'xw.directives'}))
        .pipe(gulp.dest('app/public/mobile/src/js/'));
});

gulp.task('errcode', function () {
    return gulp.src(['app/libs/errcode.js', 'app/public/mobile/src/js/_config.js'])
        .pipe(replace(/^[^{]+module\.exports[^{]+(\{[\w\W]+};)\s*$/, function (_, m) {
            return '//generated by gulp errcode' +
                    '\nangular.module("xw.config").constant("errCode", function(){' +
                    '\nreturn ' + m +
                    '\n});'
        }))
        .pipe(concat('config.js'))
        .pipe(gulp.dest('app/public/mobile/src/js'));
});







gulp.task('deleteStatic', function () {
    return del([
        // here we use a globbing pattern to match everything inside the `mobile` folder
        paths.baseStatic + paths.distMobile.root + '/**',
        paths.baseView + paths.distMobile.html + '/**',
        // we don't want to clean this file though so we negate the pattern
        '!dist/mobile/deploy.json'
    ]);
});



gulp.task('revision', ["deleteStatic"], function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.js)
        .pipe(rev())
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.js))
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.root));
});


gulp.task("html", ["revision"], function(){
    var manifest = gulp.src(paths.baseStatic + paths.distMobile.root + "/rev-manifest.json");

    return gulp.src(paths.baseStatic + paths.sourceMobile.html)
        .pipe(revReplace({manifest: manifest}))
        .pipe(gulp.dest(paths.baseView + paths.distMobile.html));
});



gulp.task("watchhtml", function(){
    gulp.watch(paths.baseStatic + paths.sourceMobile.html, ['html']);
});




//
//
//gulp.task('minify', function () {
//    var assets = useref.assets();
//
//    return gulp.src('app/views/mobile/order-address.html')
//        .pipe(assets)
//        .pipe(assets.restore())
//        .pipe(useref())
//        .pipe(gulp.dest('app/public/mobile/dist/html'));
//});



//gulp.watch(['app/libs/errcode.js', 'app/public/mobile/src/js/_config.js'], ['errcode']).on('change', function (event) {
//    console.log('File ' + event.path + ' was ' + event.type + ', running tasks `errcode`');
//})
