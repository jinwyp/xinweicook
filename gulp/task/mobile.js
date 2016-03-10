var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var rename = require('gulp-rename');

var minifyHtml = require("gulp-minify-html");
var uglify = require("gulp-uglify");
var ngTemplateCache = require('gulp-angular-templatecache');

var usemin = require('gulp-usemin');


var GulpRevAll = require('gulp-rev-all');
var revAll = new GulpRevAll();
var cleanCSS = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');

var ngAnnotate = require('gulp-ng-annotate');


var paths = {
    baseStatic : 'app/public/',
    baseView : 'app/views/',

    sourceMobile : {
        root : 'mobile/src',
        js : ['app/public/mobile/src/js/modules.js', 'app/public/mobile/src/js/*.js', '!app/public/mobile/src/js/_config.js', 'app/public/mobile/src/js/service/*.js', 'app/public/mobile/src/js/directives/*.js' ],
        jsControllers : 'mobile/src/js/controllers/*.js',
        css: 'mobile/src/css/*.css',
        img: 'mobile/src/img/**/*'
    },

    distMobile : {
        all: ['app/public/mobile/dist2/js/app.min*', 'app/public/mobile/dist2/js/controllers/*', 'app/public/mobile/dist2/css/main.min*' ],
        root : 'mobile/dist2/',
        js : 'mobile/dist2/js',
        jsControllers : 'mobile/dist2/js/controllers',
        css : 'mobile/dist2/css',
        imgDir: 'mobile/dist2/img/'
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


gulp.task('delDist', function () {
    return del([
        paths.baseStatic + paths.distMobile.root
    ]);
});



gulp.task("mobileMinifyCss", ['delDist'], function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.css)
        .pipe(concat('main.css'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(sourcemaps.init())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.css));
});


gulp.task('mobileCopyJsControllers', ['mobileMinifyCss'], function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.jsControllers)
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.jsControllers))
});

gulp.task("mobileMinifyJs", ['mobileCopyJsControllers'], function () {
    return gulp.src(paths.sourceMobile.js)
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(rename({suffix: '.min'}))
        //.pipe(sourcemaps.init())
        //.pipe(uglify())
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.js));
});



gulp.task("mobileRev", [ 'mobileMinifyJs'], function () {
    return gulp.src(paths.distMobile.all)
        .pipe(sourcemaps.init())
        .pipe(revAll.revision())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.root))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.root)) ;
});


gulp.task('mobileCopyImg', ['mobileRev'], function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.img)
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.imgDir))
});






gulp.task('mobileProduction', ['mobileCopyImg']);