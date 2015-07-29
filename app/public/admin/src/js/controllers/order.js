/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('OrderController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Orders', orderController ]);



function orderController($scope, $timeout, $state, $stateParams, Notification, Orders) {

    $scope.data = {
        searchFilter : '',
        searchOptions : {
            status : '',
            orderNumber : '',
            isSplitOrder : '',
            isChildOrder : '',
            cookingType : ''
        },

        orderList : [],
        orderListCount : 0,
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

        dishCookingType : [
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
        isAddNewStatus : false
    };

    if ($state.current.data.type === 'list'){
        Orders.getList().then(function (orders) {
            $scope.data.orderList = orders;
        });
        Orders.one('count').get().then(function (orders) {
            $scope.data.orderListCount = orders;
        });
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Orders.one($stateParams.id).get().then(function (resutlOrder) {
            $scope.data.order = resutlOrder;

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
            /*
            angular.forEach($scope.data.orderGroup, function(order) {
                if (order.zh === $scope.data.order.group.zh){
                    $scope.data.order.group = order;
                }
            });
            */
        });
    }


    $scope.searchOrder = function (form) {

        for(var p in $scope.data.searchOptions) {
            if ($scope.data.searchOptions.hasOwnProperty(p)) {
                if ($scope.data.searchOptions[p] ===''){
                    delete $scope.data.searchOptions[p];
                }
            }
        }

        Orders.getList($scope.data.searchOptions).then(function (resultOrder) {
            $scope.data.orderList = resultOrder;
            Notification.success({message: 'Search Success! ', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Search Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });

    };



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

}


