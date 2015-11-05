angular.module('xw.config').factory('commonInterceptor', ['$localStorage', '$q', function($localStorage, $q) {
    var noRedirectPath = [/^\/mobile\/$/, /^\/mobile\/login/, /^\/mobile\/cook/, /^\/mobile\/cart/, /^\/mobile\/resetpwd$/];
    var noRedirectAPI = ['/api/user', '/api/user/token', '/api/user/shoppingcart'];
    var loginRedirectPath = ['/mobile/me', '/mobile/addresslist', '/mobile/orderaddress',
        '/mobile/invite', '/mobile/coupons', '/mobile/cook', '/mobile/balance', '/mobile/chargebalanceonline'];

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
                if (noRedirectPath.some(function (RE) {return RE.test(location.pathname)})) {
                    if (noRedirectAPI.indexOf(response.config.url) != -1) {
                        return $q.reject(response);
                    }
                }
                if (loginRedirectPath.some(function(path){
                        return location.pathname.indexOf(path) != -1
                    })) {
                    redirectPath = '?redirect=' + location.pathname
                }
                setTimeout(function () {
                    // todo:
                    location.replace('/mobile/login' + redirectPath);
                }, 120);
            }
            return $q.reject(response);
        }
    };
}]);


angular.module('xw.config').config(['$httpProvider', '$compileProvider',
    function($httpProvider, $compileProvider) {
        // http interceptor
        $httpProvider.defaults.headers.common.Accept = 'application/vnd.cook.v1+json';
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = 'http://m.xinweicook.com';
        $httpProvider.defaults.headers.common['Accept-Language'] = navigator.language == 'zh-CN' ? 'zh-CN' : 'en-US';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';

        $httpProvider.interceptors.push('commonInterceptor');

        // disable debug data for performance.
        $compileProvider.debugInfoEnabled(false);
    }
]);


angular.pick = function (obj) {
    var keys = Array.prototype.slice.call(arguments, 1);
    return keys.reduce(function (o, k) {
        o[k] = obj[k];
        return o;
    }, {});
};

angular.sort = function sort (_array, compare) {
    var array = _array.slice(0);
    var tmp;
    for (var l = array.length - 1; l >= 1; l--) {
        for (var i = 0; i < l; i++) {
            var result = compare(array[i], array[i + 1]);
            if (result > 0) {
                tmp = array[i];
                array[i] = array[i + 1];
                array[i + 1] = tmp;
            }
        }
    }
    return array;
};
