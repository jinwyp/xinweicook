'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise(function ($inject, $location) {
            return $inject.get('$localStorage').access_token ? '/' : '/login';
        });

        $httpProvider.defaults.headers.common.Accept = 'application/vnd.cook.v1+json';
        $httpProvider.defaults.headers.common['Accept-Language'] = 'application/vnd.cook.v1+json';

        $httpProvider.interceptors.push('commonInterceptor');


        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/dashboard.html'
            })
            .state('index.tables', {
                url: '^/tables',
                templateUrl: 'templates/tables.html'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html'
            })
    }
]);

angular.module('RDash.config').factory('commonInterceptor', ['$localStorage', '$q', '$state', function($localStorage, $q, $state) {
    return {
        'request': function(config) {
            if ($localStorage.access_token) {
                config.headers.Authorization = 'Bearer ' + $localStorage.access_token;
            }

            return config;
        },

        'responseError': function(response) {
            // do something on error
            if (response.status == 403) {
                // todo: redirect
                $state.go('login');
            }
            return $q.reject(response);
        }
    };
}]);