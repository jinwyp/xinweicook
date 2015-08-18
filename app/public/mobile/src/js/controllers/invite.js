angular.module('xw.controllers').controller('inviteCtrl', function ($scope, Debug, Weixin) {

    $scope.showShareGroup = false;

    var testLink = 'http://m.xinweicook.com/mobile/app';
    var testImgUrl = 'http://m.xinweicook.com/mobile/src/img/icons/ToolbarCartIcon.png';
    var testDesc = '微信分享测试之分享描述-desc';

    function init() {
        Weixin.getJsconfig().then(function (res) {

            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });

            Weixin.ready(function () {
                Debug.alert('ready');
                $scope.share2Friends = function () {
                    Weixin.shareTimeline({
                        title: '微信分享至朋友圈测试',
                        link: testLink,
                        imgUrl: testImgUrl,
                        desc: testDesc,
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
                    })
                };

                $scope.share2Friend = function () {
                    Weixin.shareAppMessage({
                        title: '微信分享至朋友测试',
                        link: testLink,
                        imgUrl: testImgUrl,
                        desc: testDesc,
                        success: function (res) {
                            Debug.alert('分享至朋友成功');
                            Debug.alert(res);
                        },
                        cancel: function (res) {
                            Debug.alert('取消分享至朋友');
                            Debug.alert(res);
                        },
                        fail: function (res) {
                            Debug.alert('分享至朋友失败');
                            Debug.alert(res);
                        }
                    })
                };
            })
        }).catch(function (res) {
            Debug.alert('获取jsconfig失败');
            Debug.alert(res);
        })
    }

    init();
})