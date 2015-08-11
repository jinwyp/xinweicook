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

            //验证地址是否有效,并给予无效地址一个0的经纬度
            user.address.forEach(function (address) {
                address.geoLatitude = address.geoLatitude || 0;
                address.geoLongitude = address.geoLongitude || 0;
            });

            if ($localStorage.selectedAddress) {
                $scope.selectedAddress = $localStorage.selectedAddress;
            }
        })
    }

    init();
})