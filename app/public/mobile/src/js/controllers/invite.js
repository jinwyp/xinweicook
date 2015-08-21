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

    function init() {
        var avatar;
        var avatarCount = 16; // todo:头像数量. 用gulp来替换也许比较好
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
            Debug.alert('getUser绑定share');
            bindShare($scope.role, $scope.place)
        }).catch(function (res) {
            Debug.alert('获取用户信息后出错');
            Debug.alert(res);
        });

        function bindShare(name, place) {
            try {
                var queries = prefix +
                    '/' + Utils.utf2b64(name) +
                    '/' + Utils.utf2b64(place);
                link = location.href.replace('invite', 'invited' + queries).replace(/\?.*/, '');
                var title = name + '约你一起去' + place + '吃便当';

                Debug.alert(link);
                Weixin.shareAppMessage({
                    title: title,
                    link: link,
                    imgUrl: 'http://m.xinweicook.com/mobile/src/img/xw.jpg',
                    desc: '',
                    //todo: 需要复用success
                    success: function (res) {
                        Debug.alert('分享至朋友成功');
                        Debug.alert(res);
                        $scope.css.showTip = false;
                        alert('分享成功!');
                    },
                    cancel: function (res) {
                        Debug.alert('取消分享朋友');
                        Debug.alert(res);
                    },
                    fail: function (res) {
                        Debug.alert('分享至朋友失败');
                        Debug.alert(res);
                    }
                });
                Weixin.shareTimeline({
                    title: name + '约你一起去' + place + '吃便当',
                    link: link,
                    imgUrl: 'http://m.xinweicook.com/mobile/src/img/xw.jpg',
                    success: function (res) {
                        Debug.alert('分享至朋友圈成功');
                        Debug.alert(res);
                        $scope.css.showTip = false;
                        User.invitedFriends().then(function () {
                            alert('分享成功!');
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
            } catch (e) {
                Debug.alert('绑定share出错');
                Debug.alert(e)
            }


        }

        $scope.$watchGroup(['role', 'place'], function (newValues) {
            if (!$scope.user) return;
            Debug.alert('role, place更改绑定share');
            bindShare(newValues[0], newValues[1]);
        });

        Weixin.getJsconfig().then(function (res) {

            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });

            Weixin.ready(function () {
                Debug.alert('ready');
                bindShare($scope.role, $scope.place);
                $scope.ready = true;
            })
        }).catch(function (res) {
            Debug.alert('获取jsconfig失败');
            Debug.alert(res);
        })
    }

    init();
})