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
            });
        },
        logOut: function () {
            return $http.post('/api/user/logout', {
                token_type_hint: 'access_token',
                token: $localStorage.access_token
            }).then(function (data) {
                $localStorage.access_token = '';
                return data;
            });
        }
    };
});




angular.module('RDash.models').factory('Util', function ($http) {
    return {
        delAllProperty: function (obj){
            for(var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (obj[p] ===''){
                        delete obj[p];
                    }
                    if (angular.isArray(obj[p]) ){

                        if(obj[p].length === 0 && p !== 'preferences'){
                            delete obj[p];
                        }else{
                            angular.forEach(obj[p], function(subobj, index){
                                if(!angular.isUndefined(subobj.zh) && subobj.zh == ''){
                                    obj[p].splice(index, 1);
                                }

                                if(!angular.isUndefined(subobj.title) && subobj.title.zh == '' && !angular.isUndefined(subobj.value) && subobj.value.zh == ''){
                                    obj[p].splice(index, 1);
                                }
                                if(!angular.isUndefined(subobj.quantity) && (subobj.quantity == '' || subobj.quantity == null)) {
                                    obj[p].splice(index, 1);
                                }

                            });
                        }
                    }else if (angular.isObject(obj[p])) {
                        //console.log(this);
                        this.delAllProperty(obj[p]);

                        var hasPro = false;
                        for(var pchild in obj[p]) {
                            hasPro = true;
                        }
                        if (!hasPro){
                            delete obj[p];
                        }
                    }
                }
            }
            return obj;
        },

        delProperty: function (obj){
            for(var p in obj) {
                if (obj.hasOwnProperty(p)) {
                    if (obj[p] === '' || obj[p] === null ){
                        delete obj[p];
                    }
                }
            }
            return obj;
        },

        formatParam: function (options, isSort){
            var result = {
                query : JSON.stringify(options.query)
            };

            if (typeof options.sort !== 'undefined' && options.sort && isSort){
                result.sort = options.sort;
            }

            if (typeof options.skip !== 'undefined' && options.skip){
                result.skip = options.skip;
            }

            if (typeof options.limit !== 'undefined' && options.limit){
                result.limit = options.limit;
            }

            //console.log(decodeURIComponent('http://localhost:3003/api/admin/accountdetails/count?limit=200&query=%7B%22isPlus%22:%22true%22%7D&sort=-createdAt'));

            return result;
        },


        chartDataFormat : function(chartData, isTotalPrice){

            var simpleChartSeries = [
                {"name": "Some data", "data": [1, 2, 4, 7, 3]},
                {"name": "Some data 3", "data": [3, 1, null, 5, 2], connectNulls: true},
                {"name": "Some data 2", "data": [5, 2, 2, 3, 5], type: "column"},
                {"name": "My Super Column", "data": [1, 1, 2, 3, 2], type: "column"}
            ];

            var result = [
                { name : "值",  showInLegend: false, data : [] }
            ];

            if (angular.isArray(chartData)){
                angular.forEach(chartData, function(value, key) {

                    if(typeof value.dishSaleQuantity !== 'undefined'){
                        // dish
                        result[0].data.push(Math.abs(value.dishSaleQuantity));
                    }else if (typeof value.saleTotalPrice !== 'undefined'){
                        // order
                        if (isTotalPrice){
                            result[0].data.push(Math.abs(value.saleTotalPrice));

                        }else{
                            result[0].data.push(Math.abs(value.saleQuantity));
                        }

                    }else if(typeof value.userQuantity !== 'undefined'){
                        // user
                        result[0].data.push(Math.abs(value.userQuantity));
                    }

                }, result[0].data);
            }



            if (angular.isArray(chartData)){

                if (typeof chartData[0].typeAll !== 'undefined'){

                    result.push( { name : "值",  showInLegend: false, data : [] });
                    result.push( { name : "值",  showInLegend: false, data : [] });


                    angular.forEach(chartData, function(value, key) {

                        result[0].data.push(Math.abs(value.typeAll));
                        //result[0].type = 'line';
                        result[0].name = '食材包和便当都下过单用户数';

                        result[1].data.push(Math.abs(value.typeEat));
                        //result[1].type = 'line';
                        result[1].name = '只下过便当订单用户数';

                        result[2].data.push(Math.abs(value.typeCook));
                        //result[2].type = 'line';
                        result[2].name = '只下过食材包订单用户数';

                    })

                }else if (typeof chartData[0].userFisrtOrderQuantity !== 'undefined'){

                    result.push( { name : "值",  showInLegend: false, data : [] });
                    result.push( { name : "值",  showInLegend: false, data : [] });
                    result.push( { name : "百分比",  showInLegend: false, data : [] });


                    angular.forEach(chartData, function(value, key) {

                        result[0].data.push(Math.abs(value.userDailyCount));
                        //result[0].type = 'line';
                        result[0].name = '每日下单总用户数';

                        result[1].data.push(Math.abs(value.userFisrtOrderQuantity));
                        //result[1].type = 'line';
                        result[1].name = '每日下单新用户数数';

                        result[2].data.push(Math.abs(value.userFisrtOrderPercent));
                        //result[1].type = 'line';
                        result[2].name = '每日下单新用户数占比';


                    })

                }

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
                    //console.log(value);

                    if(typeof value.date !== 'undefined'){
                        // order by date and dish by date and new user by date
                        this.push(value.date);
                    }else if (typeof value.hour !== 'undefined') {
                        // order by hour
                        this.push( value.hour  );
                    }

                }, result);
            }

            return result;
        }

    };
});



angular.module('RDash.models').factory('Devices', function (Restangular) {
    return Restangular.service('devices');
});
angular.module('RDash.models').factory('Couriers', function (Restangular) {
    return Restangular.service('deliverytraces');
});
angular.module('RDash.models').factory('Cooks', function (Restangular) {
    return Restangular.service('cooks');
});
angular.module('RDash.models').factory('Users', function (Restangular) {
    return Restangular.service('users');
});
angular.module('RDash.models').factory('UserAddresses', function (Restangular) {
    return Restangular.service('useraddresses');
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

angular.module('RDash.models').factory('Positions', function (Restangular) {
    return Restangular.service('promotionpositions');
});


angular.module('RDash.models').factory('Coupons', function (Restangular) {
    return Restangular.service('coupons');
});


angular.module('RDash.models').factory('Announcements', function (Restangular) {
    return Restangular.service('announcements');
});

angular.module('RDash.models').factory('Warehouses', function (Restangular) {
    return Restangular.service('warehouses');
});




angular.module('RDash.models').factory('Logs', function (Restangular) {
    return Restangular.service('logs');
});

angular.module('RDash.models').factory('Settings', function (Restangular) {
    return Restangular.service('settings');
});

angular.module('RDash.models').factory('Crons', function (Restangular) {
    return Restangular.service('cronjobs');
});




angular.module('RDash.models').factory('Statistic', function ($http) {
    return {
        orderSendSMS: function (postdata) {
            return $http.post('/api/administrator/orders/sms', postdata);
        },

        searchOrderDeliveryKSuDi: function (orderId) {
            var url = '/api/administrator/order/delivery/ksudi/order/' + orderId;
            return $http.get(url);
        },
        createOrderDeliveryKSuDi: function (orderId) {
            var url = '/api/administrator/order/delivery/ksudi/order/' + orderId;
            return $http.post(url);
        },
        createOrderDeliveryKSuDiFullTime: function (orderId) {
            var url = '/api/administrator/order/delivery/ksudi/orderfullltime/' + orderId;
            return $http.post(url);
        },

        getOrderStatisticByAddress: function (params) {
            return $http.get('/api/admin/statistic/order/address', {
                params: params
            });
        },

        getOrderStatisticByAddressAuto: function (params) {
            return $http.get('/api/admin/statistic/order/addressauto', {
                params: params
            });
        },


        getOrderStatisticByMonthlySales: function (params) {
            return $http.get('/api/admin/statistic/order/monthly', {
                params: params
            });
        },

        getOrderStatisticByWeeklySales: function (params) {
            return $http.get('/api/admin/statistic/order/weekly', {
                params: params
            });
        },

        getOrderStatisticByDailySales: function (params) {
            return $http.get('/api/admin/statistic/order/daily', {
                params: params
            });
        },

        getOrderStatisticByHourSales: function (params) {
            return $http.get('/api/admin/statistic/order/hour', {
                params: params
            });
        },

        getDishStatisticByStock: function (params) {
            return $http.get('/api/admin/statistic/dish/stock', {
                params: params
            });
        },

        getDishStatisticByDaily: function (params) {
            return $http.get('/api/admin/statistic/dish/daily', {
                params: params
            });
        },
        getDishStatisticChartByDaily: function (params) {
            return $http.get('/api/admin/statistic/dish/daily/chart', {
                params: params
            });
        },
        getDishStatisticChartByWeekly: function (params) {
            return $http.get('/api/admin/statistic/dish/weekly/chart', {
                params: params
            });
        },


        getUserStatisticOfNewComers: function (params) {
            return $http.get('/api/admin/statistic/user/newcomer', {
                params: params
            });
        },

        getUserStatisticLoyalPurchaseFrequency: function (params) {
            return $http.get('/api/admin/statistic/user/frequency', {
                params: params
            });
        },

        getUserStatisticNewFirstOrderUserDaily: function (params) {
            return $http.get('/api/admin/statistic/user/firstorder/daily', {
                params: params
            });
        },

        getUserStatisticOrderFrequency: function (params) {
            return $http.get('/api/admin/statistic/user/order/frequency', {
                params: params
            });
        },

        getUserStatisticOrderUserWeekly: function (params) {
            return $http.get('/api/admin/statistic/user/order/weekly', {
                params: params
            });
        },

        getUserStatisticOrderUserMonthly: function (params) {
            return $http.get('/api/admin/statistic/user/order/monthly', {
                params: params
            });
        },

        getUserStatisticOrderUserYearly: function (params) {
            return $http.get('/api/admin/statistic/user/order/yearly', {
                params: params
            });
        },

        getUserStatisticCouponByName: function (params) {
            return $http.get('/api/admin/statistic/user/coupon/name', {
                params: params
            });
        },

        getUserAccountStatisticByPaid: function (params) {
            return $http.get('/api/admin/statistic/user/accoutdetail/paid', {
                params: params
            });
        }
    };
});
