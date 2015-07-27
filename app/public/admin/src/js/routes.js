'use strict';

angular.module('RDash').factory('commonInterceptor', ['$localStorage', '$q', '$location', function($localStorage, $q, $location) {
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
                $location.url('/login')

            }
            return $q.reject(response);
        }
    };
}]);



/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'RestangularProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider, RestangularProvider) {

        RestangularProvider.setBaseUrl('/api/admin');

        RestangularProvider.setRestangularFields({id: '_id'});


        $httpProvider.defaults.headers.common.Accept = 'application/vnd.cook.v1+json';
        $httpProvider.defaults.headers.common['Accept-Language'] = navigator.language == 'zh-CN' ? 'zh-CN' : 'en-US';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';


        $httpProvider.interceptors.push('commonInterceptor');




        /////////////////////////////
        // Redirects and Otherwise //
        /////////////////////////////

        // For unmatched routes. params not injected by angular but by ui-router
        $urlRouterProvider.otherwise(function ($inject, $location) {
            return $inject.get('$localStorage').access_token ? '/dishes' : '/login';
        });



        //////////////////////////
        // State Configurations //
        //////////////////////////

        // Use $stateProvider to configure your states.


        // Application routes
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: function ($scope, User, $http, $location) {
                    $scope.login = function () {
                        User.login($scope.username, $scope.password).then(function () {
                            $location.url('/dishes')
                        })
                    };
                }
            })
            .state('menu', {
                //url: '/',
                templateUrl: 'templates/leftmenu.html'
            })
            .state('menu.dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html'
            })
            .state('menu.tables', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            })

            .state('menu.users', {
                url: '/users',
                templateUrl: 'templates/user/userList.html',
                data: {
                    title: '用户管理',
                    type : 'list'
                },
                controller: 'UserController'
            })


            .state('menu.dishes', {
                url: '/dishes',
                templateUrl: 'templates/dish/dishList.html',
                data: {
                    title: '菜品管理',
                    type : 'list'
                },
                controller: 'DishController'
            })
            .state('menu.addNewDish', {
                url: '/dishadd',
                templateUrl: 'templates/dish/dishDetail.html',
                data: {
                    title: '菜品管理',
                    type : 'add'
                },
                controller: 'DishController'
            })
            .state('menu.updateDish', {
                url: '/dish/:id',
                templateUrl: 'templates/dish/dishDetail.html',
                data: {
                    title: '菜品管理',
                    type : 'update'
                },
                controller: 'DishController'
            })

            .state('menu.tags', {
                url: '/tags',
                templateUrl: 'templates/dish/tagList.html',
                data: {
                    title: '标签管理',
                    type : 'list'
                },
                controller: 'TagController'
            })
            .state('menu.updateTag', {
                url: '/tags/:id',
                templateUrl: 'templates/dish/tagDetail.html',
                data: {
                    title: '标签管理',
                    type : 'update'
                },
                controller: 'TagController'
            })
            .state('menu.addNewTag', {
                url: '/tagadd',
                templateUrl: 'templates/dish/tagDetail.html',
                data: {
                    title: '标签管理',
                    type : 'add'
                },
                controller: 'TagController'
            })


            .state('menu.orders', {
                url: '/orders',
                templateUrl: 'templates/order/orderList.html',
                data: {
                    title: '订单管理',
                    type : 'list'
                },
                controller: 'OrderController'
            })
            .state('menu.updateOrder', {
                url: '/orders/:id',
                templateUrl: 'templates/order/orderDetail.html',
                data: {
                    title: '订单管理',
                    type : 'update'
                },
                controller: 'OrderController'
            })


            .state('menu.coupons', {
                url: '/coupons',
                templateUrl: 'templates/coupon/couponList.html',
                data: {
                    title: '优惠码管理',
                    type : 'list'
                },
                controller: 'CouponController'
            })
            .state('menu.addNewCoupon', {
                url: '/couponadd',
                templateUrl: 'templates/coupon/couponList.html',
                data: {
                    title: '优惠码管理',
                    type : 'add'
                },
                controller: 'CouponController'
            })

            .state('menu.logs', {
                url: '/logs',
                templateUrl: 'templates/log/logList.html',
                data: {
                    title: '日志管理',
                    type : 'list'
                },
                controller: 'LogController'
            })
    }
]);

angular.module('RDash').factory('DishDetailDecorator', function () {
    return function (scope) {
        scope.dummyDish = {
            tagFilter: ''
            //topping: ''
        };

        scope.dummyAdd = function (key) {
            var value = scope.dummyDish[key];
            console.log(value);
            if (value === '') return;
            scope.dish[key] = scope.dish[key] || [];
            scope.dish[key].push(value);
            scope.dummyDish[key] = '';
        };

        scope.checkAll = function () {
            Object.keys(scope.dummyDish).forEach(scope.dummyAdd)
        }
    }
});

