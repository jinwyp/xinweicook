angular.module('xw.controllers').controller('addressListCtrl',
function ($scope, Address, Debug, User, $localStorage, ScopeDecorator, $q, Weixin) {
    ScopeDecorator.common($scope);

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
            })
        });
    }

    init();
})
//# sourceMappingURL=address-list.c8fcf9f2.js.map
