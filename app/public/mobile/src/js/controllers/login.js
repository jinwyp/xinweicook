angular.module('xw.controllers').controller('loginCtrl', loginCtrl);

function loginCtrl($scope, User, $location, $timeout, Alert) {
    $scope.loginData = {};
    $scope.signupData = {};
    $scope.resetPwdData = {};
    $scope.path = '';
    //$scope.remains = 60;

    var pwdErrTimes = 0;
    $scope.login = function (form) {
        User.login($scope.loginData.username, $scope.loginData.password, couponcode).then(function (res) {
            var redirect = location.search.substring(1).split('=');
            if (redirect.length > 1) {
                redirect = redirect[1];
                if (!/(\/\w*)+/.test(redirect)) {
                    redirect = '';
                }
            }
            $timeout(function () {
                location.href = redirect || '/mobile';
            },120);
        }).catch(function (res) {
            // todo:
            if (res.data) {
                if (res.data.validationStatus == 1111) {
                    if (++pwdErrTimes >= 2) {
                        alert('密码错误, 请重试. \n提示: 新味PC网站(xinweicook.com)的帐号与新味便当暂不兼容, 如果您是PC版老用户, 烦请重新注册!')
                    } else {
                        alert('密码错误, 请重试');
                    }
                } else Alert.show(res.data.validationStatus, '登录失败, 请稍后再试')
            } else {
                alert('登录失败, 请稍后再试');
            }
        })
    };
    
    $scope.signup = function (form) {
        User.signup(
            $scope.signupData.mobile,
            $scope.signupData.pwd,
            $scope.signupData.code,
            couponcode
        ).then(function (res) {
            // todo: redirect
            alert('注册成功!');
            $timeout(function () {
                location.href = '/mobile';
            }, 120)
        }).catch(function (res) {
            Alert.show(res.data.validationStatus, '注册失败,请稍后重试');
        })
    };

    $scope.resetPwd = function () {
        User.resetPwd(
            $scope.resetPwdData.mobile,
            $scope.resetPwdData.pwd,
            $scope.resetPwdData.code
        ).then(function (res) {
            alert('密码重置成功,请重新登录!');
            $location.path('/login');
        }).catch(function (res) {
            Alert.show(res.data.validationStatus, '重置密码失败, 请稍后重置');
        })
    };

    $scope.back = function () {
        history.back();
    };

    $scope.$on('$locationChangeStart', function () {
        $scope.path = $location.path();
    });

    var couponcode = '';

    function init() {
        var path = $location.path() || '/login';
        $location.path(path);
        $scope.path = path;

        var searches = location.search.slice(1).split('&');
        searches = searches.reduce(function (obj, cur) {
            cur = cur.split('=');
            obj[cur[0]] = decodeURIComponent(cur[1]);
            return obj;
        }, {});

        couponcode = searches.couponcode || '';

        User.getUserInfo().then(function (res) {
            // 如果在登录页面获取到用户信息,那么跳转到首页
            setTimeout(function () {
                location.href = '/mobile/';
            }, 120);
        })
    }

    init();
}
