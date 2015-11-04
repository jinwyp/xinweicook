angular.module('xw.directives').directive('smsButton', function (Debug, User, $interval) {
    return {
        scope: {
            valid: '@',
            mobile: '@',
            type: '@'
        },
        templateUrl: 'sms-button.html',
        link : function (scope) {
            scope.state = 0; // {0: init-not-ready, 1: init-ready, 2: receiving, 3: refetch-not-ready, 4: refetch-ready}
            scope.remains = 60;

            var cancel = watchMobile();

            scope.getSmsCode = function () {
                scope.state = 2;
                if (cancel) {
                    cancel();
                    cancel = null;
                }

                var timer = $interval(function () {
                    if (!--scope.remains) {
                        $interval.cancel(timer);
                        scope.remains = 60;

                        Debug.assert(typeof scope.valid == 'string', '由@传入的valid应当是string');
                        if (scope.valid === 'true') {
                            scope.state = 4;
                        } else {
                            scope.state = 3;
                        }

                        // 重新 watch mobile
                        cancel = watchMobile();
                    }
                }, 1000);

                User.getSmsCode({
                    mobile: scope.mobile,
                    type: scope.type
                }).then(function (res) {
                    //dev
                    if (res.data.code) {
                        // todo: should alert some thing?
                    }
                }).catch(function (res) {
                    // todo: should alert some thing?
                    alert('获取验证码失败,请稍后重试');
                    Debug.alert(res);
                })
            };

            function watchMobile() {
                return scope.$watch('mobile', function (mobile) {
                    if (scope.state === 0 && mobile && mobile.length == 11) {
                        scope.state = 1;
                    } else if (scope.state === 1 && (!mobile || mobile.length != 11)) {
                        scope.state = 0;
                    } else if (scope.state === 3 && mobile && mobile.length ==11) {
                        scope.state = 4;
                    } else if (scope.state === 4 && (!mobile || mobile.length != 11)) {
                        scope.state = 3;
                    }
                })
            }
        }
    }
})