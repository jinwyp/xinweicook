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
            skip : 0,
            limit : 500,
            status : '',
            orderNumber : '',
            _id : '',
            isSplitOrder : '',
            isChildOrder : '',
            cookingType : ''
        },

        currentDeleteIndex : -1,

        orderListCount : 0,
        orderListCurrentPage : 1,
        orderListTotalPages : 1,
        orderListPagesArray : [],

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


    function delProperty (obj){
        for(var p in obj) {
            if (obj.hasOwnProperty(p)) {
                if (obj[p] ===''){
                    delete obj[p];
                }
            }
        }
    }


    $scope.searchOrderCount = function (){
        delProperty($scope.data.searchOptions);

        Orders.one('count').get($scope.data.searchOptions).then(function (orders) {
            $scope.data.orderListCount = orders.count;
            $scope.data.orderListTotalPages = Math.ceil(orders.count / $scope.data.searchOptions.limit);

            $scope.data.orderListPagesArray= [];
            for (var i = 1; i <= $scope.data.orderListTotalPages; i++){
                $scope.data.orderListPagesArray.push({value:i})
            }

            $scope.searchOrder();

        });
    };

    $scope.searchOrder = function (form) {

        delProperty($scope.data.searchOptions);

        Orders.getList($scope.data.searchOptions).then(function (resultOrder) {
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

        Orders.one('count').get().then(function (orders) {
            $scope.data.orderListCount = orders.count;
            $scope.data.orderListTotalPages = Math.ceil(orders.count / $scope.data.searchOptions.limit);

            for (var i = 1; i <= $scope.data.orderListTotalPages; i++){
                $scope.data.orderListPagesArray.push({value:i})
            }

            Orders.getList().then(function (orders) {
                $scope.data.orderList = orders;
            });

            $scope.searchOrder();

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


