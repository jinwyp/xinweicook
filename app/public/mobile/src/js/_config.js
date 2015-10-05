angular.module('xw.config').factory('commonInterceptor', ['$localStorage', '$q', function($localStorage, $q) {
    var noRedirectPath = [/^\/mobile\/$/, /^\/mobile\/login/, /^\/mobile\/cook/, /^\/mobile\/cart/];
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
                    location.href = '/mobile/login' + redirectPath ;
                }, 120);
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


angular.pick = function (obj) {
    var keys = Array.prototype.slice.call(arguments, 1);
    return keys.reduce(function (o, k) {
        o[k] = obj[k];
        return o;
    }, {});
};

