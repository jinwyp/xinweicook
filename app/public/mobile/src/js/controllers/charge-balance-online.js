angular.module('xw.controllers').controller('chargeBalanceOnlineCtrl', function ($scope, Debug, Alert, Balance) {

    function init() {
        $scope.chargeSelections = [
            {
                price: 300,
                coin: 350
            },
            {
                price: 500,
                coin: 600
            },
            {
                price: 1000,
                coin: 1250
            },
            {
                price: 2000,
                coin: 2600
            }
        ];

        Balance.balance().then(function (res) {
            $scope.balance = res.data.balance;
        }).catch(Debug.promiseErrFn('查询余额失败'));
    }

    init();

});