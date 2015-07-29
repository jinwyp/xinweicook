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
            return $http.get('/api/orders/' + orderId);
        },
        updateOrder: function (id, data) {
            return $http.put('/api/orders/' + id, data)
        },
        getList: function () {
            return $http.get('/api/orders');
        },
        getUnifiedOrder: function (data) {
            return $http.post('/api/orders/payment/weixinpay/unifiedorder', data);
        },
        getJsconfig: function (url) {
            return $http.post('/api/orders/payment/weixinpay/config', {url: url});
        },
        updateOrder: function (id, isPaid) {
            return $http.put('/api/orders/' + id, isPaid);
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