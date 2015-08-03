angular.module('xw.controllers').controller('orderlistCtrl', orderlistCtrl);

function orderlistCtrl($scope, Orders) {

    function init() {
        Orders.getList().then(function (res) {
            $scope.orders = res.data;
        })
    }

    $scope.back = function () {
        history.back();
    };

    init();
}