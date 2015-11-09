angular.module('xw.controllers').controller('balanceRecordsCtrl', function ($scope, Balance) {
    Balance.balanceRecords().then(function (res) {
        $scope.records = res.data;
    })
});