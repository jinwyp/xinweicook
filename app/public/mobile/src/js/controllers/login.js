angular.module('xw.login').controller('loginCtrl', loginCtrl);

function loginCtrl($scope, User, $location, $interval, $timeout) {
    $scope.loginData = {};
    $scope.signupData = {};
    $scope.path = '';
    $scope.smsState = 0; //{0: init-not-ready, 1: init-ready, 2: receiving, 3: refetch-not-ready, 4: refetch-ready}
    $scope.remains = 60;
    
    $scope.login = function (form) {
        User.login($scope.loginData.username, $scope.loginData.password).then(function (res) {
            // todo: redirect
            //document.location = 'detail page'
            $timeout(function () {
                location.href = '/mobile';
            },100);
        }).catch(function (res) {
            alert('login failed')
        })
    };
    
    $scope.signup = function (form) {

        User.signup(
            $scope.signupData.mobile,
            $scope.signupData.pwd,
            $scope.signupData.code
        ).then(function (res) {
                // todo: redirect
                $timeout(function () {
                    location.href = '/mobile';
                }, 100)
            }).catch(function (res) {
                alert('signup failed');
            })
    };

    $scope.back = function () {
        history.back();
    }

    var cancel = $scope.$watch('signupData.mobile', function (mobile) {
        if ($scope.smsState === 0 && mobile && mobile.length == 11) {
            $scope.smsState = 1;
        } else if ($scope.smsState === 1 && (!mobile || mobile.length != 11)) {
            $scope.smsState = 0;
        }
    });

    $scope.getSmsCode = function (form) {
        $scope.smsState = 2;
        if (cancel) {
            cancel();
            cancel = null;
        }

        var timer = $interval(function () {
            if (!--$scope.remains) {
                $interval.cancel(timer);
                $scope.remains = 60;

                if (form.$valid) {
                    $scope.smsState = 4;
                } else {
                    $scope.smsState = 3;
                }
            }
        }, 1000);

        User.getSmsCode($scope.signupData.mobile).then(function (res) {
            //dev
            if (res.data.code) {
                alert(res.data.code);
                console.log(res.data.code);
                // todo: should alert some thing?
            }
        }).catch(function (res) {
            // todo: should alert some thing?
            alert('fetch sms code failed');
            console.log(res);
        })
    };

    $scope.$on('$locationChangeStart', function () {
        $scope.path = $location.path();
    });

    function init() {
        var path = $location.path() || '/login';
        $location.path(path);
        $scope.path = path;

    }

    init();
}
