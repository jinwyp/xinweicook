angular.module('xw.controllers').controller('meCtrl', meCtrl);

function meCtrl($scope, User, $localStorage, Debug) {

    $scope.isDebug = Debug.isDebug;

    $scope.logout = function () {
        User.logout().then(function () {
            location.href = 'login'
        })
    };

    $scope.back = function () {
        history.back();
    };

    function init() {
        User.getUserInfo();
    }

    init();
}
