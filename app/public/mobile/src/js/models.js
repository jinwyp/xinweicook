angular.module('xw.models').factory('Dishes', function (Restangular) {
    return Restangular.service('dishes');
});

angular.module('xw.models').factory('Orders', function (Restangular) {
    return Restangular.service('orders');
});


angular.module('xw.models').factory('User', function ($http, $localStorage) {
    return {
        login: function (username, password) {
            return $http.post('/api/user/token', {
                username: username,
                password: password,
                grant_type: 'password'
            }).then(function (res) {
                if (res.data && res.data.access_token) {
                    $localStorage.access_token = res.data.access_token;
                }

                return res;
            })
        },
        signup: function (mobile, pwd, code) {
            return $http.post('/api/user/signup', {
                mobile: mobile,
                pwd: pwd,
                code: code
            })
        },
        getSmsCode: function (mobile) {
            return $http.post('/api/user/sms', {
                mobile: mobile,
                type: 'signUp'
            })
        }
    }
});