angular.module('xw.controllers').controller('couponsCtrl', function ($scope, User, Debug, ScopeDecorator, Alert) {

    ScopeDecorator.common($scope);

    $scope.apply = function () {
        if ($scope.invitationCode == $scope.user.invitationSendCode) {
            // todo: to be deleted
            alert('亲,这是您自己的邀请码, 是给您的好友兑换的, 自己不能兑换哦. \n当您的好友使用此兑换码兑换了优惠券,并成功通过它购买后,你就可以获得优惠券');
            return;
        }
        User.applyInvitationCode($scope.invitationCode).then(function () {
            alert('兑换成功!');
            $scope.invitationCode = '';
            User.getUserInfo().then(function (res) {
                $scope.couponList = res.data.couponList;
            });
        }).catch(function (res) {
            Alert.show(res.data.validationStatus, '兑换失败, 请稍后再试');
        })
    };

    function init() {
        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
            $scope.couponList = res.data.couponList;

            var now = new Date(res.headers('Date'))
            $scope.goodCards = []
            $scope.badCards = []
            res.data.couponList.forEach(function (el) {
                if (!el.isUsed && (new Date(el.endDate) > now))
                    $scope.goodCards.push(el)
                else $scope.badCards.push(el)
            })
        });

        var invitationCode = location.search.substring(1).split('=');
        if (invitationCode.length > 1) {
            invitationCode = invitationCode[1];
            if (/^\w{8}$/.test(invitationCode)) {
                $scope.invitationCode = invitationCode;
            }
        }
    }

    init();
});