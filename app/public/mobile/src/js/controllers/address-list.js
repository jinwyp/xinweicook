angular.module('xw.controllers').controller('addressListCtrl',
function ($scope, Address, Debug, User, $localStorage, ScopeDecorator, $q) {
    ScopeDecorator.common($scope);

    $scope.remove = function (idx) {
        $scope.addresses.splice(idx, 1);
    };

    function init() {
        $q.all([Address.range(), Address.getList()]).then(function (res) {
            $scope.range = res[0].data;
            $scope.addresses = res[1].data;
        })
    }

    init();
})