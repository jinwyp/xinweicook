angular.module('xw.config').factory('commonInterceptor', ['$localStorage', '$q', function($localStorage, $q) {
    var noRedirectPath = ['/mobile/', '/mobile/login'];
    var loginRedrectPath = ['/mobile/me', '/mobile/addresslist', '/mobile/invite', '/mobile/coupons'];

    return {
        'request': function(config) {
            if ($localStorage.access_token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.access_token;
            }

            return config;
        },

        'responseError': function(response) {
            // do something on error
            var redirectPath = '';
            if (response.status == 401) {
                // todo: redirect
                console.log(401);
                if (noRedirectPath.indexOf(location.pathname) == -1) {
                    if (loginRedrectPath.indexOf(location.pathname) != -1) {
                        redirectPath = '?redirect=' + location.pathname
                    }
                    setTimeout(function () {
                        // todo:
                        location.href = '/mobile/login' + redirectPath ;
                    }, 120);
                }
            }
            return $q.reject(response);
        }
    };
}]);


angular.module('xw.config').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.headers.common.Accept = 'application/vnd.cook.v1+json';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://m.xinweicook.com';
        $httpProvider.defaults.headers.common['Accept-Language'] = navigator.language == 'zh-CN' ? 'zh-CN' : 'en-US';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';


        $httpProvider.interceptors.push('commonInterceptor');
    }
]);

/**
 * check css feature
 */
angular.module('xw.config').run([function () {
    // feature detect do not work
/*    var isSupportFilter = /ipad|iphone|chrome/.test(navigator.userAgent.toLowerCase());
    if (!isSupportFilter) {
        document.body.classList.add('no-filter');
    }*/
}]);

angular.pick = function (obj) {
    var keys = Array.prototype.slice.call(arguments, 1);
    return keys.reduce(function (o, k) {
        o[k] = obj[k];
        return o;
    }, {});
};

