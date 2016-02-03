angular.module('xw.controllers').controller('orderlistCtrl2', orderlistCtrl2);

function orderlistCtrl2($scope, Orders, $location) {

    $scope.orders = null
    $scope.curOrder = null
    $scope.address = null

    $scope.back = function () {
        history.back();
    };

    $scope.cancelOrder = function (id) {
        Orders.cancel(id).then(function () {
            $scope.orders.some(function (order) {
                if (order._id == id) {
                    order.status = 'canceled'
                    return true
                }
            })
        })
    }

    $scope.$on('$locationChangeSuccess', function () {
        var id = $location.path().slice(1);
        if (!id || !$scope.orders) {
            $scope.curOrder = null
            return
        }

        $scope.orders.some(function (order) {
            if (order._id == id) {
                $scope.curOrder = order
                return true
            }
        })
    })

    function init() {
        Orders.getList().then(function (res) {
            $scope.orders = res.data.filter(function (order) {
                if (order.dishList.some(function (el) {
                        return !el.dish
                    })) return false

                var hasEat, hasCook
                order.dishList.forEach(function (el) {
                    if (el.dish.cookingType == 'ready to cook') {
                        hasCook = true
                    }
                    if (el.dish.cookingType == 'ready to eat') {
                        hasEat = true
                    }
                })

                if (hasEat && hasCook) {
                    order.cookingType = '食材包&便当'
                } else if (hasEat) {
                    order.cookingType = '便当'
                } else {
                    order.cookingType = '食材包'
                }

                // 未支付的订单, 过滤isChildOrder:true; 已支付的显示子订单, 过滤isSplitOrder:true
                if (order.status == 'not paid') {
                    return !order.isChildOrder
                } else {
                    return !order.isSplitOrder
                }
            })
        })
    }

    init();
}