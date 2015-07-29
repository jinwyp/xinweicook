angular.module('xw.models').factory('Dishes', function ($http) {
    return {
        getList: function () {
            return $http.get('http://api.xinweicook.com/dishes')
        }
    }
});

angular.module('xw.models').factory('Orders', function ($http) {
    return {
        postOrder: function (data) {
            return $http.post('http://api.xinweicook.com/orders', data);
        },
        deliveryTime: function (data) {
            data.cookingType = 'ready to eat';
            return $http.post('http://api.xinweicook.com/orders/delivery/time', data)
        },
        getOrder: function (orderId) {
            return $http.get('http://api.xinweicook.com/orders/' + orderId);
        },
        updateOrder: function (id, data) {
            return $http.put('http://api.xinweicook.com/orders/' + id, data)
        },
        getList: function () {
            return $http.get('http://api.xinweicook.com/orders');
        },
        getUnifiedOrder: function (data) {
            return $http.post('http://api.xinweicook.com/orders/payment/weixinpay/unifiedorder', data);
        },
        getJsconfig: function (url) {
            return $http.post('http://api.xinweicook.com/orders/payment/weixinpay/config', {url: url});
        },
        updateOrder: function (id, isPaid) {
            return $http.put('http://api.xinweicook.com/orders/' + id, isPaid);
        }
    }
});

angular.module('xw.models').factory('User', function ($http, $localStorage) {
    return {
        login: function (username, password) {
            return $http.post('http://api.xinweicook.com/user/token', {
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
            return $http.post('http://api.xinweicook.com/user/signup', {
                mobile: mobile,
                pwd: pwd,
                code: code
            })
        },
        getSmsCode: function (mobile) {
            return $http.post('http://api.xinweicook.com/user/sms', {
                mobile: mobile,
                type: 'signUp'
            })
        },
        logout: function () {
            return $http.post('http://api.xinweicook.com/user/logout', {
                token_type_hint: "access_token",
                token: $localStorage.access_token
            })
        },
        getUserInfo: function () {
            return $http.get('http://api.xinweicook.com/user');
        }
    }
});

angular.module('xw.models').factory('Coupon', function ($http) {
    return {
        getCouponInfo: function (code) {
            return $http.get('http://api.xinweicook.com/coupons/code/' + code);
        }
    }
});