angular.module('xw.controllers').controller('addressListCtrl', function ($scope, Debug, User, $localStorage, ScopeDecorator) {
    ScopeDecorator.common($scope);

    $scope.editAddress = function (addr) {
        $localStorage.editAddress = addr;
        setTimeout(function () {
            location.href = 'addressedit';
        }, 100); // wait for updating localStorage.
    };

    $scope.chooseAddress = function (addr) {
        $scope.selectedAddress = $localStorage.selectedAddress = addr;
    };

    function init() {
        User.getUserInfo().then(function (res) {
            var user = res.data;
            $scope.addresses = user.address;
            if ($localStorage.selectedAddress) {
                $scope.selectedAddress = $localStorage.selectedAddress;
            }
        })
    }

    init();
})