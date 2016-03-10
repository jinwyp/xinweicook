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

    $scope.pay = function () {
        if ($scope.curOrder.payment == 'weixinpay') {
            location.href = '/mobile/wxpay/' + $scope.curOrder._id
        } else if ($scope.curOrder.payment == 'alipay direct') {
            Orders.payByAlipay($scope.curOrder._id).then(function (res) {
                location.href = res.data.fullurl
            })
        }
    }

    $scope.$on('$locationChangeSuccess', function () {
        setCurOrder()
    })

    function setCurOrder() {
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
    }

    function init() {
        Orders.getList().then(function (res) {
            // 首先过滤出子订单,以便在之后的遍历中使用
            var childOrders = res.data.reduce(function (map, order) {
                if (order.isChildOrder) {
                    map[order._id] = order
                }
                return map
            }, {})

            $scope.orders = res.data.filter(function (order) {
                if (order.dishList.some(function (el) {
                        return !el.dish
                    })) return false

                order.cookList = []
                order.eatList = []
                order.dishList.forEach(function (el) {
                    if (el.dish.cookingType == 'ready to cook') {
                        order.cookList.push(el)
                    }
                    if (el.dish.cookingType == 'ready to eat') {
                        order.eatList.push(el)
                    }
                })

                if (order.eatList.length && order.cookList.length) {
                    order.cookingType = '食材包&便当'
                } else if (order.eatList.length) {
                    order.cookingType = '便当'
                } else {
                    order.cookingType = '食材包'
                }

                // 未支付的订单, 过滤isChildOrder:true; 已支付的显示子订单, 过滤isSplitOrder:true
                if (order.status == 'not paid') {
                    if (!order.isChildOrder) {
                        order.childOrderList.forEach(function (id) {
                            var child = childOrders[id]
                            var type = child.cookingType == 'ready to cook' ? 'cookList' : 'eatList'
                            order[type].deliveryDateTime = child.deliveryDateTime
                        })
                        return true
                    }
                } else {
                    return !order.isSplitOrder
                }
            })

            setCurOrder()
        })
    }

    init();
}