angular.module('xw.controllers').controller('orderAddressCtrl', function (
    Weixin, $scope, Address, $localStorage, $timeout, $q, Utils) {

    var backUrl = '/mobile';

    $scope.next = function (event) {
        if ($scope.save) {
            var promise = $scope.save(event);
            if (promise && typeof promise.then == 'function') {
                promise.then(function (address) {
                    $localStorage.selectedAddress = address;
                    $timeout(function () {
                        location.replace(backUrl);
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
        });

        var searches = Utils.searches(location.search);
        if (searches.dishId) {
            backUrl = '/mobile/cook/' + searches.dishId;
        } else if (searches.path) {
            backUrl = '/mobile/#' + searches.path
        }
    }

    init();
});
