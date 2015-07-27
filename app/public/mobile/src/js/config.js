angular.module('xw.config').factory('commonInterceptor', ['$localStorage', '$q', '$location', function($localStorage, $q, $location) {
    return {
        'request': function(config) {
            if ($localStorage.access_token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.access_token;
            }

            return config;
        },

        'responseError': function(response) {
            // do something on error
            if (response.status == 401) {
                // todo: redirect
                console.log(401);
                location.href = 'login.html'

            }
            return $q.reject(response);
        }
    };
}]);


angular.module('xw.config').config(['$httpProvider',
    function($httpProvider) {
        $httpProvider.defaults.headers.common.Accept = 'application/vnd.cook.v1+json';
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
    var isSupportFilter = /ipad|iphone|chrome/.test(navigator.userAgent.toLowerCase());
    if (!isSupportFilter) {
        document.body.classList.add('no-filter');
    }
}]);

