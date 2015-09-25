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
            if (response.status == 401 || response.status == 403) {
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
                controller: function ($scope, User, $http, $location, $document) {
                    $scope.css = false;
                    $scope.login = function () {
                        User.login($scope.username, $scope.password).then(function () {
                            $location.url('/dishes')
                        }).catch(function(){
                            $scope.css = true;
                        })

                    };

                    $scope.data = {
                        geetestId : '745d959dec1191e086febd11aa684c9d',
                        challenge : '',
                        src : ''
                    };
                    $http.get('/api/user/signup/geetest/register').success(function(result) {
                        console.log(result);
                        $scope.data.challenge = result.challenge;
                        $scope.data.src = 'http://api.geetest.com/get.php?gt=' + $scope.data.geetestId + '&challenge=' + $scope.data.challenge;
                        //$scope.data.src = 'http://api.geetest.com/get.php?gt=' + $scope.data.geetestId;

                        console.log($scope.data.src);
                        var s = document.createElement('script');
                        s.src = $scope.data.src;
                        s.async = true;

                        var fatherDom = angular.element(document.getElementsByClassName('geetest'));

                        fatherDom.append(s);//append the script where ever you want
                    })
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
            .state('menu.updateUser', {
                url: '/user/:id',
                templateUrl: 'templates/user/userDetail.html',
                data: {
                    title: '用户管理',
                    type : 'update'
                },
                controller: 'UserController'
            })
            .state('menu.addNewUser', {
                url: '/useradd',
                templateUrl: 'templates/user/userDetail.html',
                data: {
                    title: '用户管理',
                    type : 'add'
                },
                controller: 'UserController'
            })

            .state('menu.accountDetails', {
                url: '/accountdetails',
                templateUrl: 'templates/user/accountDetailList.html',
                data: {
                    title: '账户余额明细管理',
                    type : 'list'
                },
                controller: 'UserAccountDetailController'
            })

            .state('menu.updateAccount', {
                url: '/account/:id',
                templateUrl: 'templates/user/userAccount.html',
                data: {
                    title: '账户余额管理',
                    type : 'update'
                },
                controller: 'UserAccountController'
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
            .state('menu.updateDish', {
                url: '/dish/:id',
                templateUrl: 'templates/dish/dishDetail.html',
                data: {
                    title: '菜品管理',
                    type : 'update'
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
            .state('menu.updateCoupon', {
                url: '/coupons/:id',
                templateUrl: 'templates/coupon/couponDetail.html',
                data: {
                    title: '优惠码管理',
                    type : 'update'
                },
                controller: 'CouponController'
            })
            .state('menu.addNewCoupon', {
                url: '/couponadd/:userId',
                templateUrl: 'templates/coupon/couponDetail.html',
                data: {
                    title: '优惠码管理',
                    type : 'add'
                },
                controller: 'CouponController'
            })



            .state('menu.deviceTokens', {
                url: '/devicetokens',
                templateUrl: 'templates/user/deviceTokenList.html',
                data: {
                    title: 'iOS设备ID管理',
                    type : 'list'
                },
                controller: 'UserDeviceController'
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

            .state('menu.cronjobs', {
                url: '/cronjobs',
                templateUrl: 'templates/cron/cronList.html',
                data: {
                    title: '定时任务管理',
                    type : 'list'
                },
                controller: 'CronController'
            })
            .state('menu.updateCron', {
                url: '/cron/:id',
                templateUrl: 'templates/cron/cronDetail.html',
                data: {
                    title: '定时任务管理',
                    type : 'update'
                },
                controller: 'CronController'
            })
            .state('menu.addNewCron', {
                url: '/cronadd',
                templateUrl: 'templates/cron/cronDetail.html',
                data: {
                    title: '定时任务管理',
                    type : 'add'
                },
                controller: 'CronController'
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

