angular.module('xw.controllers').controller('loginCtrl', loginCtrl);

function loginCtrl($scope, User, $location, Alert, Weixin, $localStorage) {
    $scope.loginData = {};
    $scope.signupData = {};
    $scope.resetPwdData = {};
    $scope.path = '';

    $scope.sms = {
        state: 'init' // 短信按钮的状态
    };

    $scope.css = {
        pending: false,
        triggered: false, // 表示是否已经尝试发送短信码
        hasVoiceSent: false // 表示是否已经尝试发送语音短信
    };

    $scope.login = function () {
        $scope.css.pending = true;
        User.login($scope.loginData.username, $scope.loginData.password, couponcode)
        .then(redirect)
        .catch(function (res) {
            resetPending();
            if (res.data) {
                if (res.data.validationStatus == 1111) {
                    alert('密码错误, 请重试');
                } else Alert.show(res.data.validationStatus, '登录失败, 请稍后再试')
            } else {
                alert('登录失败, 请稍后再试');
            }
        })
    };
    
    $scope.signup = function () {
        $scope.css.pending = true;
        User.signup(
            $scope.signupData.mobile,
            $scope.signupData.pwd,
            $scope.signupData.code,
            couponcode,
            searches.referrer
        ).then(function () {
            // todo: redirect
            alert('注册成功!');
            redirect();
        }).catch(function (res) {
            resetPending();
            Alert.show(res.data.validationStatus, '注册失败,请稍后重试');
        })
    };

    $scope.resetPwd = function () {
        $scope.css.pending = true;
        User.resetPwd(
            $scope.resetPwdData.mobile,
            $scope.resetPwdData.pwd,
            $scope.resetPwdData.code
        ).then(function (res) {
            alert('密码重置成功,请重新登录!');
            location.href = '/mobile/login'
        }).catch(function (res) {
            resetPending();
            Alert.show(res.data.validationStatus, '重置密码失败, 请稍后重置');
        })
    };

    $scope.getVoiceSms = function () {
        if ($scope.css.hasVoiceSent || !$scope.css.triggered) return
        $scope.css.hasVoiceSent = true
        User.getSmsCode({
            mobile: $scope.signupData.mobile,
            type: 'signUp',
            isVoice: "true"
        }).success(function() {
            console.log("success")
        }).catch(function (res) {
            Alert.show(res.data.validationStatus, '验证码发送失败');
        });
    }

    $scope.back = function () {
        history.back();
    };

    $scope.$on('$locationChangeStart', function () {
        $scope.path = $location.path();
    });

    var couponcode = '';
    var promotion = '';
    var searches;

    function init() {
        var path = $location.path() || '/login';
        $location.path(path);
        $scope.path = path;

        searches = location.search.slice(1).split('&');
        searches = searches.reduce(function (obj, cur) {
            cur = cur.split('=');
            obj[cur[0]] = decodeURIComponent(cur[1]);
            return obj;
        }, {});

        couponcode = searches.couponcode || '';
        if (Weixin.isWeixin && couponcode.indexOf('XWNOD') == 0 && couponcode.length == 10) {
            $localStorage.promotion = promotion = couponcode;
            couponcode = '';
        }

        User.getUserInfo().then(function (res) {
            // 如果在登录页面获取到用户信息,那么跳转到首页

            // 如果用户已经处于登录状态,并且有couponcode
            if (couponcode) {
                $location.path('/login');
                return;
            }

            setTimeout(function () {
                location.href = '/mobile/';
            }, 120);
        });
    }

    function redirect() {
        var redirect = searches['redirect'];
        if (redirect) {
            if (!/(\/\w*)+/.test(redirect)) {
                redirect = '/mobile/';
            }
        } else redirect = '/mobile/';

        User.getUserInfo().then(function (res) {
            var user = res.data;

            // 未授权
            if (Weixin.isWeixin && (!user.weixinId || !user.weixinId.openid)) {
                redirect = '/api/user/weixin/oauthcode?redirectUrl=' +
                    encodeURIComponent(redirect.replace('/mobile/', '')) +
                    '&userId=' + user._id ;

                // 如果是地推活动,则强制跳到首页
                if (promotion) {
                    redirect = '/api/user/weixin/oauthcode?redirectUrl=&userId=' + user._id;
                }
            }

            setTimeout(function () {
                location.replace(redirect);
            }, 100);
        });
    }

    function resetPending() {
        $scope.css.pending = false;
    }

    init();
}
