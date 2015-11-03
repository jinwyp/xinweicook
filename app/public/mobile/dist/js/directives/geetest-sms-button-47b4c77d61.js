angular.module('xw.directives').directive('geetestSmsButton', function (Debug, User, $interval, $window, Alert, $http) {
    return {
        scope: {
            valid: '@',
            mobile: '@',
            type: '@'
        },
        templateUrl: 'geetest-sms-button.html',
        link : function (scope) {
            $http.get('/api/user/signup/geetest/register').success(function(result) {
                var s = document.createElement('script');
                var params = {
                    //'745d959dec1191e086febd11aa684c9d'
                    gt: 'd41d16df5b99010ec511ec10aaaafcb8',
                    width: document.body.offsetWidth,
                    challenge: result.challenge
                };

                s.src = 'http://api.geetest.com/get.php?' + Object.keys(params)
                        .map(function (key) {return key + '=' + params[key]})
                        .join('&');


                var fatherDom = angular.element(document.getElementById('geetestContainer'));

                fatherDom.append(s);//append the script where ever you want

                $window.gt_custom_ajax = function(result, id, message) {
                    if(result) {
                        var value = angular.element(document.getElementById('geetestContainer')).find('input');

                        var data = {
                            "geetest_challenge":value[0].value,
                            "geetest_validate":value[1].value,
                            "geetest_seccode":value[2].value,
                            "type" : scope.type,
                            "mobile" : scope.mobile
                        };

                        var timer = $interval(function () {
                            if (!--scope.remains) {
                                $interval.cancel(timer);
                                scope.remains = remains;

                                stateMachine('show-refetch', scope.valid == 'true');
                                try {
                                    GeeTest[0].refresh()
                                } catch (e) {}
                            }
                        }, 1000);

                        User.getSmsCode(data).success(function() {
                            console.log("success")
                        }).catch(function (res) {
                            Alert.show(res.data.validationStatus, '验证码发送失败');
                        });

                        stateMachine('hide-geetest')
                    }
                }
            });

            var remains = 30;
            scope.remains = 30;

            scope.$watch('mobile', function (mobile) {
                stateMachine('mobile', scope.valid == 'true')
            });

            scope.showGeetest = function () {
                stateMachine('show-geetest');
            };

            // {0: init-not-ready, 1: init-ready, 2: hide-btn-show-geetest,
            //  3: hide-geetest-show-sending 4 show-re-btn-invalid, 5 re-btn}
            scope.state = 0;
            function stateMachine(action, data) {
                var state = scope.state, isValid = !!data;
                if (action == 'mobile') {
                    if (state === 0 && isValid) {
                        scope.state = 1;
                    } else if (state == 1 && !isValid) {
                        scope.state = 0;
                    } else if (state == 2 && !isValid) {
                        scope.state = 4;
                    }
                    else if (state == 4 && isValid) {
                        scope.state = 5;
                    } else if (state == 5 && !isValid) {
                        scope.state = 4;
                    }
                } else if (action == 'show-geetest') {
                    if (state == 1 || state == 5) {
                        scope.state = 2;
                    }
                } else if (action == 'hide-geetest') {
                    if (state == 2) {
                        scope.state = 3;
                    }
                } else if (action == 'show-refetch') {
                    if (state == 3) {
                        scope.state = isValid ? 5 : 4;
                    }
                }
            }
        }
    }
})