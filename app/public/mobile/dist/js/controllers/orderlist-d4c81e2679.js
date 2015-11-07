angular.module('xw.controllers').controller('orderlistCtrl', orderlistCtrl);

function orderlistCtrl($scope, Orders) {

    function init() {
        Orders.getList().then(function (res) {
            $scope.orders = res.data.filter(function (order) {
                // 未支付的订单, 过滤isChildOrder:true; 已支付的显示子订单, 过滤isSplitOrder:true
                if (order.status == 'not paid') {
                    return !order.isChildOrder
                } else {
                    return !order.isSplitOrder
                }
            })
        })
    }

    $scope.back = function () {
        history.back();
    };

    init();
}
orderlistCtrl.$inject = ["$scope", "Orders"];