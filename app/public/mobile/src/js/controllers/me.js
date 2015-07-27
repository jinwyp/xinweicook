angular.module('xw.me').controller('meCtrl', eatCtrl);

function eatCtrl($scope, User, $localStorage) {

    $scope.logout = function () {
        User.logout().then(function () {
            location.href = 'login.html'
        })
    };


    function init() {
        if (!$localStorage.access_token) {
            location.href = 'login.html'
        }

    }

    init();
}
