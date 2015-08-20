angular.module('xw.controllers').controller('inviteCtrl', function ($scope, Debug, Weixin, User, Utils) {

    $scope.css = {
        showTip: false
    };
    $scope.ready = false;

    $scope.roles = [
        '柠则饕','榴烨','吴咽祖','梨意疯','蔬荠',
        '鹌祖拉baby','果必停','糯一','榴墙咚','粥杰伦',
        '梨命好','饭冰冰','京腥','凳炒','望风',
        '梅梅','卷腐','豆森','低卡葡黎熬','掰掰合',
        '橙薏逊', '羊幂', '糖淹', '甲奶酿', '瞪籽荠',
        '松成鲜', '淋汁苓', '煌削茗', '鱼沉庆', '油红明',
        'TFGirls'
    ];

    $scope.places = [
        '三栗屯', '仁敏广场', '老地方', '他家', '她家',
        '鹿夹嘴', '海腩岛', '续加惠', '精鹌撕', '馨舔底',
        '麻耳呆夫', '挤粥岛'
    ].map(function (place) {
        return {
            inner: place,
            display: '约你一起去' + place + '吃便当'
        }
    });

    $scope.role = $scope.roles[0];
    $scope.place = $scope.places[0].inner;

    var testImgUrl = 'http://m.xinweicook.com/mobile/src/img/icons/ToolbarCartIcon.png';

    function init() {
        var avatar;
        var avatarCount = 7;
        var link = '';
        var code = '';
        var prefix = '';
        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
            var id = $scope.user._id;
            id = '0x' + id.substr(17, 6);
            avatar = +id % avatarCount + 1;
            avatar = Utils.utf2b64(avatar);
            code = Utils.utf2b64($scope.user.invitationSendCode);
            prefix = '/' + avatar + '/' + code;
        });

        $scope.$watchGroup(['role', 'place'], function (newValues) {
            if (!$scope.user) return;
            var queries = prefix +
                          '/' + Utils.utf2b64(newValues[0]) +
                          '/' + Utils.utf2b64(newValues[1]);
            link = location.href.replace('invite', 'invited' + queries);

            Weixin.shareTimeline({
                title: newValues[0] + newValues[1],
                link: link,
                imgUrl: 'http://m.xinweicook.com/mobile/src/img/xw.jpg',
                success: function (res) {
                    Debug.alert('分享至朋友圈成功');
                    Debug.alert(res);
                    $scope.css.showTip = false;
                    User.invitedFriends().then(function () {
                        alert('分享成功, 2张优惠券到手!');
                    }).catch(Debug.promiseErrFn('分享至朋友圈后成功分享失败'))
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
        });

        Weixin.getJsconfig().then(function (res) {

            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });

            Weixin.ready(function () {
                Debug.alert('ready');

                $scope.ready = true;
            })
        }).catch(function (res) {
            Debug.alert('获取jsconfig失败');
            Debug.alert(res);
        })
    }

    init();
})