angular.module('xw.controllers').controller('balanceRecordsCtrl', ["$scope", "Balance", function ($scope, Balance) {
    Balance.balanceRecords().then(function (res) {
        $scope.records = res.data;
    })
}]);