var gulp = require('gulp');
var del = require('del');
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');
var useref = require('gulp-useref');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var minifyHtml = require("gulp-minify-html");
var minifyCss = require("gulp-minify-css");
var uglify = require("gulp-uglify");
var ngTemplateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var gulpif = require("gulp-if");
var fs = require("fs");
var usemin = require('gulp-usemin');
var sourcemaps = require('gulp-sourcemaps');



var paths = {
    baseStatic : 'app/public/',
    baseView : 'app/views/',

    sourceMobile : {
        root : 'mobile/src',
        js : 'mobile/src/js/**/*.js',
        css: 'mobile/src/css/*.css',
        html : 'mobile/src/html/**/*',
        img: 'mobile/src/img/**/*'
    },

    distMobile : {
        all: 'mobile/dist/**',
        root : 'mobile/dist/',
        js : 'mobile/dist/js',
        htmlDir: 'mobile/dist/html/',
        html: 'mobile/dist/html/**/*',
        imgDir: 'mobile/dist/img/'
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

gulp.task("mobileUsemin", ['mobileCopyImg'], function () {
    var replaceBlock = /<!-- build-replace-->([\w\W]*?)<!-- end-build-replace-->/g;
    var useminOptions = {
        css: [minifyCss(), rev()],
        js: [ngAnnotate(), sourcemaps.init(), uglify(), 'concat', rev(), sourcemaps.write('.')]
    };
    fs.readdirSync(paths.baseStatic + paths.sourceMobile.root + '/js/controllers')
        .forEach(function (file) {
            file = file.split('.')[0].split('-');
            var name = file[0];
            for (var i = 1; i < file.length; i++) {
                name += file[i][0].toUpperCase() + file[i].slice(1);
            }
            useminOptions[name] = [rev()];
        });

    return gulp.src([paths.baseStatic + paths.sourceMobile.html])
        .pipe(replace(replaceBlock, function (_, m) {
            return '<!-- build-replace-->'
                + m.replace(/\/mobile\/src\//g, '')
                + '<!-- end-build-replace-->';
        }))
        .pipe(usemin(useminOptions))
        .pipe(replace(replaceBlock, function (_, m) {
            return m.replace(/\b(href|src)="\.\.(.*?")/g, function (_, m1, m2) {
                return m1 + '="/mobile/dist' + m2
            })
        }))
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.htmlDir))
        .pipe(gulpif('js.html', gulp.dest(paths.baseStatic + paths.distMobile.htmlDir + 'includes')))
        .pipe(gulpif('css.html', gulp.dest(paths.baseStatic + paths.distMobile.htmlDir + 'includes')))
});

gulp.task('delDist', function () {
    return del([
        paths.baseStatic + paths.distMobile.all
    ]);
});

gulp.task('delMobileViewsAndIncludes', ['mobileUsemin'], function () {
    return del([
        paths.baseView + 'mobile',
        paths.baseStatic + paths.distMobile.htmlDir + '{css.html,js.html}'
    ])
});

gulp.task('mobileCopy2Views', ['delMobileViewsAndIncludes'], function () {
    return gulp.src(paths.baseStatic + paths.distMobile.html)
        .pipe(gulp.dest(paths.baseView + 'mobile'))
});

gulp.task('mobileCopyImg', ['delDist'], function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.img)
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.imgDir))
});

gulp.task('mobileProduction', ['mobileCopy2Views']);




//gulp.task('deleteStatic', function () {
//    return del([
//        // here we use a globbing pattern to match everything inside the `mobile` folder
//        paths.baseStatic + paths.distMobile.root + '/**',
//        paths.baseView + paths.distMobile.html + '/**',
//        // we don't want to clean this file though so we negate the pattern
//        '!dist/mobile/deploy.json'
//    ]);
//});
//
//
//
//gulp.task('revision', ["deleteStatic", "ng-annotate"], function () {
//    return gulp.src(paths.baseStatic + paths.tmp1Mobile.jsFiles)
//        .pipe(rev())
//        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.js))
//        .pipe(rev.manifest())
//        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.root));
//});
//
//
//gulp.task("html", ["revision"], function(){
//    var manifest = gulp.src(paths.baseStatic + paths.distMobile.root + "/rev-manifest.json");
//
//    return gulp.src(paths.baseStatic + paths.sourceMobile.html)
//        .pipe(revReplace({manifest: manifest}))
//        .pipe(gulp.dest(paths.baseView + paths.distMobile.html));
//});
//
//
//
//gulp.task("watchhtml", function(){
//    gulp.watch([
//        paths.baseStatic + paths.sourceMobile.html,
//        paths.baseStatic + paths.sourceMobile.js
//    ], ['html']);
//});




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
