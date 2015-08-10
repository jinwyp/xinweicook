angular.module('xw.controllers').controller('loginCtrl', loginCtrl);

function loginCtrl($scope, User, $location, $timeout) {
    $scope.loginData = {};
    $scope.signupData = {};
    $scope.resetPwdData = {};
    $scope.path = '';
    //$scope.remains = 60;
    
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
            alert('注册成功!');
            $timeout(function () {
                location.href = '/mobile';
            }, 100)
        }).catch(function (res) {
            alert('注册失败,请稍后重试');
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
            alert('重置密码失败, 请稍后重置');
        })
    };

    $scope.back = function () {
        history.back();
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
