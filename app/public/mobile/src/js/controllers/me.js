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

    $scope.sendFriendsOk = function () {
        User.invitedFriends();
    };


    function init() {
        if (!$localStorage.access_token) {
            location.href = 'login'
        }
        User.getUserInfo().then(function (res) {
            // todo: do nothing for now. But it will redirect to login if unauthorized.
        })
    }

    init();
}
