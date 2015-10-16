angular.module('xw.controllers').controller('loginCtrl', loginCtrl);

function loginCtrl($scope, User, $location, Alert, $http, $window) {
    $scope.loginData = {};
    $scope.signupData = {};
    $scope.resetPwdData = {};
    $scope.path = '';
    //$scope.remains = 60;

    window.onerror = function (err) {
        setTimeout(function () {
            location.href = oldUrl1;
            location.reload();
        },100);
    };

    var pwdErrTimes = 0;
    $scope.login = function (form) {
        User.login($scope.loginData.username, $scope.loginData.password, couponcode).then(redirect)
            .catch(function (res) {
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
            redirect();
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
            location.href = '/mobile/login'
        }).catch(function (res) {
            Alert.show(res.data.validationStatus, '重置密码失败, 请稍后重置');
        })
    };

    $scope.back = function () {
        history.back();
    };

    var _times = 0;
    var oldUrl1 = '';
    var oldUrl2 = '';
    $scope.$on('$locationChangeStart', function (e, url1, url2) {
        if (oldUrl1 == url1 && oldUrl2 == url2) {
            //alert('same:' + _times);
            if (_times < 3) {
                _times++
            }
        } else {
            oldUrl1 = url1;
            oldUrl2 = url2;
        }
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

            // 如果用户已经处于登录状态,并且有couponcode
            if (couponcode) {
                $location.path('/login');
                return;
            }

            setTimeout(function () {
                location.href = '/mobile/';
            }, 120);
        });

        $http.get('/api/user/signup/geetest/register').success(function(result) {
            var s = document.createElement('script');
            s.src = 'http://api.geetest.com/get.php?gt=' + '745d959dec1191e086febd11aa684c9d' +
                '&challenge=' + result.challenge;
            //$scope.data.src = 'http://api.geetest.com/get.php?gt=' + $scope.data.geetestId;

            var fatherDom = angular.element(document.getElementById('geetestContainer'));

            fatherDom.append(s);//append the script where ever you want

            $window.gt_custom_ajax = function(result, id, message) {
                if(result) {
                    var value = angular.element(document.getElementsByClassName('gt_input')).find('input');

                    var data = {
                        "geetest_challenge":value[0].value,
                        "geetest_validate":value[1].value,
                        "geetest_seccode":value[2].value,
                        "type" : location.pathname == '/mobile/login' ? 'signUp' : 'resetPassword',
                        "mobile" : location.pathname == '/mobile/login' ?  $scope.signupData.mobile : $scope.resetPwdData.mobile
                    };

                    $http.post('/api/user/sms', data).success(function(result) {
                        console.log("success")
                    });
                }
            }
        });
    }

    function redirect() {
        var redirect = location.search.substring(1).split('=');
        if (redirect.length > 1) {
            redirect = redirect[1];
            if (!/(\/\w*)+/.test(redirect)) {
                redirect = '/mobile/';
            }
        } else redirect = '/mobile/';

        User.getUserInfo().then(function (res) {
            var user = res.data;

            // 未授权
            if (!user.weixinId || !user.weixinId.openid) {
                redirect = '/api/user/weixin/oauthcode?redirectUrl=' +
                    encodeURIComponent(redirect.replace('/mobile/', '')) +
                    '&userId=' + user._id ;
            }

            setTimeout(function () {
                location.replace(redirect);
            }, 150);
        });
    }

    init();
}
