'use strict';

angular.module('RDash.config').factory('commonInterceptor', ['$localStorage', '$q', '$location', function($localStorage, $q, $location) {
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

        // For unmatched routes. params not injected by angular but by ui-router
        $urlRouterProvider.otherwise(function ($inject, $location) {
            return $inject.get('$localStorage').access_token ? '/dishes' : '/login';
        });

        $httpProvider.defaults.headers.common.Accept = 'application/vnd.cook.v1+json';
        $httpProvider.defaults.headers.common['Accept-Language'] = navigator.language == 'zh-CN' ? 'zh-CN' : 'en-US';
        $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';


        $httpProvider.interceptors.push('commonInterceptor');


        // Application routes
        $stateProvider
            .state('index', {
                //url: '/',
                templateUrl: 'templates/main.html'
            })
            .state('index.dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/dashboard.html'
            })
            .state('index.tables', {
                url: '/tables',
                templateUrl: 'templates/tables.html'
            })
            .state('index.dishes', {
                templateUrl: 'templates/dishes.html',
                url: '/dishes',
                data: {title: '菜品列表'},
                controller: function ($scope, Dishes) {
                    $scope.dishes = Dishes.getList().$object;
                }
            })
            .state('index.newDish', {
                url: '/newdish',
                templateUrl: 'templates/dishDetail.html',
                data: {title: '添加菜品'},
                controller: function ($scope, Dishes, DishDetailDecorator) {
                    var emptyDish = {
                        cover: [{}],
                        kitchenware: [{}],
                        infoUniqueFeature: [{}],
                        infoIngredient: [{}],
                        infoCookingStep: [{}],
                        priceWholesale: [{}],
                        //preferences: [{foodMaterial: [{}]}],
                        //topping: [],
                        tagFilter: [],
                        isFromAdminPanel: true
                    };

                    $scope.dish = angular.copy(emptyDish);

                    $scope.save = function () {
                        $scope.checkAll();
                        Dishes.post($scope.dish).then(function () {
                            $scope.dish = angular.copy(emptyDish)
                        })
                    };

                    DishDetailDecorator($scope);
                }
            })
            .state('index.dishDetail', {
                url: '/dishDetail/:dishId',
                templateUrl: 'templates/dishDetail.html',
                data: {title: '菜品详情'},
                controller: function ($scope, Dishes, $stateParams, $location) {
                    console.log($stateParams.dishId);

                    Dishes.one($stateParams.dishId).get().then(function (dish) {
                        $scope.dish = dish;
                    });
                    //$scope.dish = Dishes.one($stateParams.dishId).get().$object;

                    $scope.save = function () {
                        console.log($scope.dish.sortId, typeof $scope.dish.sortId);
                        $scope.dish.put().then(function () {
                            $location.url('/dishes');
                        })
                    }
                }
            })
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
            .state('index.tags', {
                url: '/tags',
                templateUrl: 'templates/tags.html',
                data: {title: '标签列表'},
                controller: function ($scope, Tags) {
                    Tags.getList().then(function (tags) {
                        $scope.tags = tags;
                    })
                }
            })
            .state('index.orders', {
                url: '/orders',
                templateUrl: 'templates/orders.html',
                data: {title: '订单管理'},
                controller: function ($scope, Orders) {
                    Orders.getList().then(function (orders) {
                        $scope.orders = orders;
                    })
                }
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
            if (value === '') return;
            scope.dish[key] = scope.dish[key] || [];
            scope.dish[key].push(value);
            scope.dummyDish[key] = '';
        };

        scope.checkAll = function () {
            Object.keys(scope.dummyDish).forEach(scope.dummyAdd)
        }
    }
})

