var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
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
        js : 'mobile/src/js/*.js',
        jsControllers : 'mobile/src/js/controllers/*.js',
        css: 'mobile/src/css/*.css',
        img: 'mobile/src/img/**/*'
    },

    distMobile : {
        all: 'mobile/dist/**',
        root : 'mobile/dist2/',
        js : 'mobile/dist2/js',
        css : 'mobile/dist2/css',
        htmlDir: 'mobile/dist2/html/',
        html: 'mobile/dist2/html/**/*',
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
        paths.baseStatic + paths.distMobile.all
    ]);
});

gulp.task('mobileCopyImg', ['delDist'], function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.img)
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.imgrootDir))
});


gulp.task("mobileMinifyCss", function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.css)
        .pipe(sourcemaps.init())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.css));
});


gulp.task("mobileMinifyJs", function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.js)
        .pipe(ngAnnotate())
        .pipe(concat('app.js'))
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.js));
});

gulp.task("mobileMinifyJsControllers", function () {
    return gulp.src(paths.baseStatic + paths.sourceMobile.jsControllers)
        .pipe(ngAnnotate())
        //.pipe(sourcemaps.init())
        //.pipe(uglify())
        //.pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.js));
});

gulp.task("mobileRev", function () {
    return gulp.src(paths.baseStatic + paths.distMobile.all)
        .pipe(revAll.revision())
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.root))
        .pipe(revAll.manifestFile())
        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.root)) ;
});

//
//gulp.task("mobileUsemin", ['mobileCopyImg'], function () {
//    var replaceBlock = /<!-- build-replace-->([\w\W]*?)<!-- end-build-replace-->/g;
//    var useminOptions = {
//        css: [sourcemaps.init(),  rev(), sourcemaps.write('.')],
//        js: [ngAnnotate(), sourcemaps.init(), uglify(), 'concat', rev(), sourcemaps.write('.')]
//    };
//    fs.readdirSync(paths.baseStatic + paths.sourceMobile.root + '/js/controllers')
//        .forEach(function (file) {
//            file = file.split('.')[0].split('-');
//            var name = file[0];
//            for (var i = 1; i < file.length; i++) {
//                name += file[i][0].toUpperCase() + file[i].slice(1);
//            }
//            useminOptions[name] = [rev()];
//        });
//
//    return gulp.src([paths.baseStatic + paths.sourceMobile.html])
//        .pipe(replace(replaceBlock, function (_, m) {
//            return '<!-- build-replace-->'
//                + m.replace(/\/mobile\/src\//g, '')
//                + '<!-- end-build-replace-->';
//        }))
//        .pipe(usemin(useminOptions))
//        .pipe(replace(replaceBlock, function (_, m) {
//            return m.replace(/\b(href|src)="\.\.(.*?")/g, function (_, m1, m2) {
//                return m1 + '="/mobile/dist' + m2
//            })
//        }))
//        .pipe(gulp.dest(paths.baseStatic + paths.distMobile.htmlDir))
//        .pipe(gulpif('js.html', gulp.dest(paths.baseStatic + paths.distMobile.htmlDir + 'includes')))
//        .pipe(gulpif('css.html', gulp.dest(paths.baseStatic + paths.distMobile.htmlDir + 'includes')))
//});



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



gulp.task('mobileProduction', ['mobileCopy2Views']);