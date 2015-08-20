angular.module('xw.controllers').controller('couponsCtrl', function ($scope, User, Debug) {

    $scope.apply = function () {
        User.applyInvitationCode($scope.invitationCode).then(function () {
            alert('兑换成功!');
            $scope.invitationCode = '';
            User.getUserInfo().then(function (res) {
                $scope.couponList = res.data.couponList;
            });
        }).catch(function (res) {
            alert('兑换失败, 请稍后再试');
            Debug.alert(res);
        })
    };

    function init() {
        User.getUserInfo().then(function (res) {
            $scope.couponList = res.data.couponList;
        })
    }

    init();
});