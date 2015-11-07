angular.module('xw.controllers').controller('balanceCtrl', ["$scope", "Balance", "Debug", function ($scope, Balance, Debug) {
    Balance.balance().then(function (res) {
        $scope.balance = res.data.balance;
    }).catch(Debug.promiseErrFn('查询余额失败'));
}]);