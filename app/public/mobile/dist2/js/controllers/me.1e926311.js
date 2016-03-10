angular.module('xw.controllers').controller('meCtrl', meCtrl);

function meCtrl($scope, User, $localStorage, Debug) {

    $scope.isDebug = Debug.isDebug;

    $scope.logout = function () {
        User.logout().then(function () {
            location.href = 'login.e6766899'
        })
    };

    $scope.back = function () {
        history.back();
    };

    function init() {
        User.getUserInfo().then(function (res) {
            var mobile = res.data.mobile;
            $scope.mobile = mobile.substr(0, 3) + '*****' + mobile.substr(8, 3)
        })
    }

    init();
}

//# sourceMappingURL=me.1e926311.js.map
