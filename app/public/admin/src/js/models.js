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
        },
        logOut: function () {
            return $http.post('/api/user/logout', {
                token_type_hint: 'access_token',
                token: $localStorage.access_token
            }).then(function (data) {
                $localStorage.access_token = '';
                return data;
            })
        }
    }
});




angular.module('RDash.models').factory('Util', function ($http) {
    return {
        delProperty: function (obj){
            for(var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (obj[p] === '' || obj[p] === null ){
                        delete obj[p];
                    }
                }
            }
            return obj
        },

        chartDataFormat : function(chartData){

            var simpleChartSeries = [
                {"name": "Some data", "data": [1, 2, 4, 7, 3]},
                {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
                {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
                {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
            ];

            var result = [
                { name : "Daily", type:"column", showInLegend: false, data : [] }
            ];

            if (angular.isArray(chartData)){
                angular.forEach(chartData, function(value, key) {
                    this.push(Math.abs(value.dishSaleQuantity));
                }, result[0].data);
            }

            return result;
        },

        chartxAxisFormat : function(chartData){

            var simpleChartxAxis = {

                title: {
                    text: 'Fruit Number'
                },
                tickInterval: 1,
                categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Carrots']
                //labels: {
                //    enabled: i === 0
                //}
            };

            var simpleChartyAxis = {
                title: {
                    text: 'Fruit eaten'
                },
                tickInterval: 1
            };


            var result = [] ;

            if (angular.isArray(chartData)){
                angular.forEach(chartData, function(value, key) {
                    this.push(value.date);
                }, result);
            }

            return result;
        }

    }
});



angular.module('RDash.models').factory('Devices', function (Restangular) {
    return Restangular.service('devices');
});
angular.module('RDash.models').factory('Users', function (Restangular) {
    return Restangular.service('users');
});
angular.module('RDash.models').factory('UserAccounts', function (Restangular) {
    return Restangular.service('useraccounts');
});
angular.module('RDash.models').factory('UserAccountDetails', function (Restangular) {
    return Restangular.service('accountdetails');
});
angular.module('RDash.models').factory('PaymentDetails', function (Restangular) {
    return Restangular.service('paymentdetails');
});


angular.module('RDash.models').factory('Dishes', function (Restangular) {
    return Restangular.service('dishes');
});
angular.module('RDash.models').factory('Inventories', function (Restangular) {
    return Restangular.service('inventories');
});

angular.module('RDash.models').factory('Tags', function (Restangular) {
    return Restangular.service('tags');
});

angular.module('RDash.models').factory('Orders', function (Restangular) {
    return Restangular.service('orders');
});


angular.module('RDash.models').factory('Coupons', function (Restangular) {
    return Restangular.service('coupons');
});



angular.module('RDash.models').factory('Logs', function (Restangular) {
    return Restangular.service('logs');
});


angular.module('RDash.models').factory('Crons', function (Restangular) {
    return Restangular.service('cronjobs');
});




angular.module('RDash.models').factory('Statistic', function ($http) {
    return {
        getOrderStatisticByAddress: function (params) {
            return $http.get('/api/admin/statistic/order/address', {
                params: params
            })
        },

        getOrderStatisticByDailySales: function (params) {
            return $http.get('/api/admin/statistic/order/daily', {
                params: params
            })
        },

        getDishStatisticByStock: function (params) {
            return $http.get('/api/admin/statistic/dish/stock', {
                params: params
            })
        },

        getDishStatisticByDaily: function (params) {
            return $http.get('/api/admin/statistic/dish/daily', {
                params: params
            })
        },

        getDishStatisticChartByDaily: function (params) {
            return $http.get('/api/admin/statistic/dish/daily/chart', {
                params: params
            })
        },


        getUserStatisticOfNewComers: function (params) {
            return $http.get('/api/admin/statistic/user/newcomer', {
                params: params
            })
        },

        getUserStatisticLoyalPurchaseFrequency: function (params) {
            return $http.get('/api/admin/statistic/user/frequency', {
                params: params
            })
        },
    };
});