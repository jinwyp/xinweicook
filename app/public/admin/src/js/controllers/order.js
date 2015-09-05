/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('OrderController', ['$scope', '$timeout', '$state', '$stateParams', '$localStorage', 'Notification', 'Util', 'Orders', 'Statistic', orderController ]);



function orderController($scope, $timeout, $state, $stateParams, $localStorage, Notification, Util, Orders, Statistic) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            skip : 0,
            limit : 500,
            createdAt :'',
            status : '',
            orderNumber : '',
            _id : '',
            isSplitOrder : '',
            isChildOrder : '',
            cookingType : '',
            clientFrom : '',
            deliveryDateType : ''
        },
        exportOrderIdList : [],

        searchSort : {
            sort : '-createdAt'
        },

        datePickerIsOpen : false,


        searchDateFrom : '',
        searchDateTo : '',

        orderListCount : 0,
        orderListCurrentPage : 1,
        orderListTotalPages : 1,
        orderListPagesArray : [],

        currentDeleteIndex : -1,



        orderStatisticByAddressList : [],
        orderList : [],
        order : {},

        orderStatusList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '未支付',
                value : 'not paid'
            },
            {
                name : '已支付',
                value : 'paid'
            },
            {
                name : '菜品制作中',
                value : 'making dish'
            },
            {
                name : '已发货',
                value : 'shipped'
            },
            {
                name : '已完成',
                value : 'finished'
            },
            {
                name : '已取消',
                value : 'canceled'
            }
        ],

        isSplitOrderList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '已拆分订单（即主订单）',
                value : 'true'
            },
            {
                name : '未拆分的订单（即需要处理发货的订单）',
                value : 'false'
            }
        ],

        isChildOrderList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '子订单',
                value : 'true'
            },
            {
                name : '非子订单（包括不需要拆单的正常订单和需要拆单的主订单）',
                value : 'false'
            }
        ],

        dishCookingTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '食材包',
                value : 'ready to cook'
            },
            {
                name : '既食包',
                value : 'ready to eat'
            }
        ],

        clientFromTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : 'PC版网站',
                value : 'website'
            },
            {
                name : '移动版网站',
                value : 'mobileweb'
            },
            {
                name : '微信公众平台',
                value : 'wechat'
            },
            {
                name : 'iOS 原生APP',
                value : 'ios'
            },
            {
                name : '安卓 原生APP',
                value : 'android'
            }
        ],

        deliveryDateTypeList : [
            {
                name : 'ALL',
                value : ''
            },
            {
                name : '当天配送',
                value : 'today'
            },
            {
                name : '第二天配送',
                value : 'tomorrow'
            }
        ],

        expressList : [
            {
                name : '顺丰外地',
                displayName : {
                    zh : '顺丰快递',
                    en : 'sf-express'
                },
                info :{
                    zh : '顺丰快递 国内最好的快递',
                    en : 'sf-express'
                }
            },
            {
                name : '顺丰当日',
                displayName : {
                    zh : '顺丰当日快递',
                    en : 'sf-sh'
                },
                info :{
                    zh : '顺丰当日快递 国内最好的快递',
                    en : 'sf-express'
                }
            },
            {
                name : '黑猫',
                displayName : {
                    zh : '黑猫快递',
                    en : '黑猫快递'
                },
                info :{
                    zh : '黑猫快递',
                    en : '黑猫快递'
                }
            },
            {
                name : '快速递',
                displayName : {
                    zh : '快速递',
                    en : '快速递'
                },
                info :{
                    zh : '快速递',
                    en : '快速递'
                }
            },
            {
                name : '趣活',
                displayName : {
                    zh : '趣活快递',
                    en : '趣活快递'
                },
                info :{
                    zh : '趣活快递',
                    en : '趣活快递'
                }
            },
            {
                name : '达达',
                displayName : {
                    zh : '达达快递',
                    en : '达达快递'
                },
                info :{
                    zh : '达达快递',
                    en : '达达快递'
                }
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : false,
        showTable : 'orders'
    };

    $scope.datePickerOpen = function($event) {
        $scope.data.datePickerIsOpen = true;
    };


    $scope.searchOrderCount = function (){

        if ($localStorage.orderSearchOptions){
            $scope.data.searchOptions = $localStorage.orderSearchOptions
        }

        $scope.css.showTable = 'orders';

        if ($scope.data.searchDateFrom !==''){
            //console.log (new Date($scope.data.searchDateFrom));
            $scope.data.searchOptions.createdAt = '>=' + new Date($scope.data.searchDateFrom);
        }


        Util.delProperty($scope.data.searchOptions);

        Orders.one('count').get($scope.data.searchOptions).then(function (orders) {
            $localStorage.orderSearchOptions = $scope.data.searchOptions;

            $scope.data.orderListCount = orders.count;
            $scope.data.orderListTotalPages = Math.ceil(orders.count / $scope.data.searchOptions.limit);

            $scope.data.orderListPagesArray= [];
            for (var i = 1; i <= $scope.data.orderListTotalPages; i++){
                $scope.data.orderListPagesArray.push( {value : i} )
            }

            $scope.searchOrder();

        });
    };


    $scope.searchOrder = function (form) {
        Util.delProperty($scope.data.searchOptions);

        var options = angular.extend({}, $scope.data.searchOptions, $scope.data.searchSort);
        Orders.getList(options).then(function (resultOrder) {
            $scope.data.orderList = resultOrder;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };

    $scope.changePagination = function (currentPageNo) {
        $scope.data.orderListCurrentPage = currentPageNo;
        $scope.data.searchOptions.skip = ($scope.data.orderListCurrentPage-1) * $scope.data.searchOptions.limit;
        $scope.searchOrder();
    };

    $scope.delOrder = function (order) {

        var index = $scope.data.orderList.indexOf(order);

        $scope.data.orderList[index].remove().then(function (resultOrder) {
            $scope.searchOrderCount();

            Notification.success({message : 'Delete Success', delay : 8000});

        }).catch(function (err) {
            Notification.error({
                message : "Delete Failure! Status:" + err.status + " Reason: " + err.data.message,
                delay   : 5000
            });
        });

    };




    if ($state.current.data.type === 'list'){
        $scope.searchOrderCount()
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Orders.one($stateParams.id).get().then(function (resutlOrder) {
            $scope.data.order = resutlOrder;
            $scope.data.order.aliPaySign = {
                "service": "alipay.wap.create.direct.pay.by.user",
                    "partner": "2088111042213083",
                    "_input_charset": "utf-8",
                    "sign_type": "MD5",
                    "notify_url": "http://m.xinweicook.com/api/orders/payment/alipay/mobile",
                    "return_url": "/alipay/return",
                    "out_trade_no": "201509050141212183743",
                    "subject": "干煸茶树菇孜然雪花牛柳",
                    "total_fee": 68,
                    "seller_id": "2088111042213083",
                    "payment_type": "1",
                    "body": "干煸茶树菇孜然雪花牛柳",
                    "sign": "592cb18d58af83cf02c6f3adef83fb3b"
            };


            //编辑order时， 处理order express 显示
            if (angular.isUndefined($scope.data.order.express)){
                $scope.data.order.express = {
                    name : '',
                    displayName : {
                        zh : '',
                        en : ''
                    },
                    info :{
                        zh : '',
                        en : ''
                    },
                    number : ''
                }
            }


            //编辑order时， 处理order dishList 菜品详情 显示
            if (angular.isArray($scope.data.order.dishList) && angular.isArray($scope.data.order.dishHistory) ){
                $scope.data.order.dishListHash = {};

                angular.forEach($scope.data.order.dishHistory, function(dish, dishIndex){
                    $scope.data.order.dishListHash[dish.dish._id] = dish
                });
                angular.forEach($scope.data.order.dishList, function(dish, dishIndex){
                    dish.detail = $scope.data.order.dishListHash[dish.dish];

                    if (angular.isArray(dish.subDish) ){
                        angular.forEach(dish.subDish, function(subDish, subDishIndex) {
                            subDish.detail = $scope.data.order.dishListHash[subDish.dish]
                        })
                    }

                });
            }

        });
    }




    $scope.updateOrder = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.order.put().then(function (resultOrder) {
            console.log(resultOrder);
            Notification.success({message: 'Update Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };


    $scope.clickExpressRadio = function (express) {
        $scope.data.order.express.name = express.name;
        $scope.data.order.express.displayName = express.displayName;
        $scope.data.order.express.info = express.info;
    };















    $scope.searchOrderStatistic = function () {
        $scope.css.showTable = 'statistic';

        if ($scope.data.searchDateFrom !==''){
            $scope.data.searchOptions.createdAt = new Date($scope.data.searchDateFrom);
        }


        Util.delProperty($scope.data.searchOptions);

        Statistic.getOrderStatisticByAddress($scope.data.searchOptions).then(function (resultOrder) {
            $scope.data.orderStatisticByAddressList = resultOrder.data;
            Notification.success({message: 'Search Success! ', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };



    // toggle selection for a given fruit by name
    $scope.toggleSelection = function toggleSelection(orderId) {
        var idx = $scope.data.exportOrderIdList.indexOf(orderId);

        // is currently selected
        if (idx > -1) {
            $scope.data.exportOrderIdList.splice(idx, 1);
        } else {
            // is newly selected
            $scope.data.exportOrderIdList.push(orderId);
        }

    };


    $scope.arrayToUrl = function (array) {
        return JSON.stringify(array)
    };


}


