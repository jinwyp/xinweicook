angular.module('xw.controllers').controller('balanceCtrl', function ($scope, Balance, Debug) {
    Balance.balance().then(function (res) {
        $scope.balance = res.data.balance;
    }).catch(Debug.promiseErrFn('查询余额失败'));
});
//# sourceMappingURL=balance.440b15ce.js.map
