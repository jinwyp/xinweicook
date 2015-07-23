/**
 * Created by jinwyp on 7/22/15.
 */





angular
    .module('RDash')
    .controller('OrderController', ['$scope', '$timeout', '$state', '$stateParams', 'Notification', 'Orders', orderController ]);



function orderController($scope, $timeout, $state, $stateParams, Notification, Orders) {

    $scope.data = {
        searchFilter : '',
        orderList : [],
        order : {
            name:{
                zh : '',
                en : ''
            },
            group : {
                zh : '',
                en : ''
            },
            isFilter : false
        },

        orderGroup : [
            {
                zh : '菜系',
                en : 'Dishes system'
            },
            {
                zh : '食材',
                en : 'Ingredients'
            },
            {
                zh : '场景',
                en : 'Occasion'
            },
            {
                zh : '推荐促销',
                en : 'Promotion'
            }
        ]
    };

    $scope.css = {
        isAddNewStatus : true
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
            angular.forEach($scope.data.orderGroup, function(order) {
                if (order.zh === $scope.data.order.group.zh){
                    $scope.data.order.group = order;
                }
            });
        });
    }


    $scope.addNewOrder = function (form) {
        if (form.$invalid) {
            return;
        }

        var newOrder = angular.copy($scope.data.order);
        //console.log (newOrder);
        Orders.post(newOrder).then(function (resultOrder) {
            console.log(resultOrder);
            Notification.success({message: 'Save Success', delay: 8000});

        }).catch(function(err){
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };

    $scope.updateOrder = function (form) {
        if (form.$invalid) {
            return;
        }

        $scope.data.order.put().then(function (resultOrder) {
            console.log(resultOrder);
            Notification.success({message: 'Update Success', delay: 8000});
        }).catch(function(err){
            console.log(err);
            Notification.error({message: "Update Failure! Status:" + err.status + " Reason: " + err.data.message , delay: 5000});
        });
    };


}
