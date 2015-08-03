angular.module('xw.controllers').controller('addressEditCtrl', function ($scope, Debug, Address, User, $localStorage) {
    $scope.Address = Address;
    $scope.address = $localStorage.editAddress;
    $scope.css = {
        showFakeInput: true
    };

    function init() {
        User.getUserInfo().then(function (res) {
            var user = $scope.user = res.data;
            $scope.address = $scope.address || {};

        });
        // todo:after get address info, set showFakeInput be false if address has a province property.

        $scope.css.showFakeInput = !$scope.address.province;

    }
})