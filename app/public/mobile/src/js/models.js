angular.module('xw.models').factory('Dishes', function ($http) {
    return {
        getList: function () {
            return $http.get('/api/dishes')
        }
    }
});

angular.module('xw.models').factory('Orders', function ($http) {
    return {
        postOrder: function (data) {
            return $http.post('/api/orders', data);
        },
        deliveryTime: function (data) {
            data.cookingType = 'ready to eat';
            return $http.post('/api/orders/delivery/time', data)
        },
        getOrder: function (orderId) {
            return $http.get('/api/orders/' + orderI);
        }
    }
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
        },
        logout: function () {
            return $http.post('/api/user/logout', {
                token_type_hint: "access_token",
                token: $localStorage.access_token
            })
        },
        getUserInfo: function () {
            return $http.get('/api/user');
        }
    }
});

angular.module('xw.models').factory('Coupon', function ($http) {
    return {
        getCouponInfo: function (code) {
            return $http.get('/api/coupons/code/' + code);
        }
    }
});