angular.module('xw.controllers').controller('inviteCtrl', function ($scope, Debug, Weixin, User, Utils) {

    $scope.css = {
        showTip: false
    };
    $scope.ready = false;

    $scope.roles = ['陈盥洗', '麻花腾', '粥杰伦'];
    $scope.places = ['优衣窟', '北戴河', '钓鱼岛', '火星', 'Kepler-452b', '召唤师峡谷', '艾欧尼亚'].map(function (place) {
        return {
            inner: place,
            display: '约你一起去' + place + '吃便当'
        }
    });

    $scope.role = $scope.roles[0];
    $scope.place = $scope.places[0].inner;

    var testImgUrl = 'http://m.xinweicook.com/mobile/src/img/icons/ToolbarCartIcon.png';

    function init() {
        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
        });

        var link = '';

        $scope.$watchGroup(['role', 'place'], function (newValues) {
            if (!$scope.user) return;
            var queries = '/' + Utils.utf2b64($scope.user.invitationSendCode) +
                          '/' + Utils.utf2b64(newValues[0]) +
                          '/' + Utils.utf2b64(newValues[1]);
            link = location.href.replace('invite', 'invited' + queries);
        });

        Weixin.getJsconfig().then(function (res) {

            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });

            Weixin.ready(function () {
                Debug.alert('ready');
                Weixin.shareTimeline({
                    title: '微信分享至朋友圈测试',
                    link: link,
                    imgUrl: testImgUrl,
                    desc: '描述能不能用?',
                    success: function (res) {
                        Debug.alert('分享至朋友圈成功');
                        Debug.alert(res);
                    },
                    cancel: function (res) {
                        Debug.alert('取消分享至朋友圈');
                        Debug.alert(res);
                    },
                    fail: function (res) {
                        Debug.alert('分享至朋友圈失败');
                        Debug.alert(res);
                    }
                });

                $scope.ready = true;
            })
        }).catch(function (res) {
            Debug.alert('获取jsconfig失败');
            Debug.alert(res);
        })
    }

    init();
})