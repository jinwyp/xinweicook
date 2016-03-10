angular.module('xw.controllers').controller('chargeBalanceCtrl', function ($scope, Balance, Debug, Alert) {
    $scope.charge = function (code) {
        Balance.chargeByCode(code).then(function () {
            alert('充值成功')
        }).catch(function (res) {
            Debug.alert('充值失败');
            Debug.alert(res);
            Alert.show(res.data.validationStatus, '充值失败,请稍后重试');
        })
    }
});
//# sourceMappingURL=charge-balance.78c344b1.js.map
