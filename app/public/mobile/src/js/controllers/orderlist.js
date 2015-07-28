angular.module('xw.orderlist').controller('orderlistCtrl', orderlistCtrl);

function orderlistCtrl($scope, Orders) {

    function init() {
        Orders.getList().then(function (res) {
            $scope.orders = res.data;
        })
    }

    init();
}