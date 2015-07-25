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
            isChildOrder : ''
        },

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
        ]
    };

    $scope.css = {
        isAddNewStatus : false
    };

    if ($state.current.data.type === 'list'){
        Orders.getList().then(function (orders) {
            $scope.data.orderList = orders;
        });
    }

    if ($state.current.data.type === 'update'){
        $scope.css.isAddNewStatus = false;

        Orders.one($stateParams.id).get().then(function (resutlOrder) {
            $scope.data.order = resutlOrder;

            //编辑order时， 处理order group 显示
            //angular.forEach($scope.data.orderGroup, function(order) {
            //    if (order.zh === $scope.data.order.group.zh){
            //        $scope.data.order.group = order;
            //    }
            //});
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


}
