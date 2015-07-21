angular.module('RDash.models').factory('Dishes', function (Restangular) {
    return Restangular.service('dishes');
});

angular.module('RDash.models').factory('Tags', function (Restangular) {
    return Restangular.service('tags');
});

angular.module('RDash.models').factory('Orders', function (Restangular) {
    return Restangular.service('orders');
});


angular.module('RDash.models').factory('User', function ($http, $localStorage) {
    return {
        login: function (username, password) {
            return $http.post('/api/user/token', {
                username: username,
                password: password,
                grant_type: 'password'
            }).then(function (data) {
                if (data.data && data.data.access_token) {
                    $localStorage.access_token = data.data.access_token;
                }

                return data;
            })
        }
    }
});

gulp.task("usemin", function() {
    return gulp.src(paths.index).pipe(usemin({
        js: [minifyJs(), "concat"],
        css: [
            minifyCss({
                keepSpecialComments: 0
            }), "concat"
        ]
    })).pipe(gulp.dest("dist/"));
});

gulp.task("usemin-admin", function () {
    return gulp.src(paths.adminIndex).pipe(usemin({
        js: [minifyJs(), "concat"],
        css: [
            minifyCss({
                keepSpecialComments: 0
            }), "concat"
        ]
    })).pipe(gulp.dest(paths.adminDist));
});

gulp.task("usemin-mobile", function () {
    return gulp.src(paths.mobileIndex).pipe(usemin({
        js: [minifyJs(), "concat"],
        css: [
            minifyCss({
                keepSpecialComments: 0
            }), "concat"
        ]
    })).pipe(gulp.dest(paths.mobileDist));
});

gulp.task("usemin-web", function () {
    return gulp.src(paths.webIndex).pipe(usemin({
        js: [minifyJs(), "concat"],
        css: [
            minifyCss({
                keepSpecialComments: 0
            }), "concat"
        ]
    })).pipe(gulp.dest(paths.webDist));
});