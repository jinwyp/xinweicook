angular.module('xw.controllers').controller('meCtrl', eatCtrl);

function eatCtrl($scope, User, $localStorage) {

    $scope.logout = function () {
        User.logout().then(function () {
            location.href = 'login'
        })
    };

    $scope.back = function () {
        history.back();
    };


    function init() {
        if (!$localStorage.access_token) {
            location.href = 'login'
        }
    }

    init();
}
