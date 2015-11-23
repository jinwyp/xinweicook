angular.module('xw.controllers').controller('orderAddressCtrl', function (
    Weixin, $scope, Address, $localStorage, $timeout, $q) {

    $scope.next = function (event) {
        if ($scope.save) {
            var promise = $scope.save(event);
            if (promise && typeof promise.then == 'function') {
                promise.then(function (address) {
                    $localStorage.selectedAddress = address;
                    $timeout(function () {
                        location.replace('/mobile');
                    }, 119);
                })
            }
        }
    };

    function init() {
        $q.all([Address.range(), Address.getList()]).then(function (res) {
            $scope.range = res[0].data;
            $scope.addresses = res[1].data;
        });

        Weixin.isWeixin && Weixin.getJsconfig().then(function (res) {
            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });
        })
    }



    init();
});