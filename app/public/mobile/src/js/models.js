angular.module('xw.models').factory('Dishes', function ($http) {
    return {
        getList: function () {
            return $http.get('/api/dishes')
        },
        like: function (id) {
            return $http.put('/api/dishes/' + id + '/like');
        },
        getOne: function (id) {
            return $http.get('/api/dishes/' + id);
        }
    }
});

angular.module('xw.models').factory('Orders', function ($http) {
    return {
        postOrder: function (data) {
            return $http.post('/api/orders', data);
        },
        deliveryTime: function (data) {
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
        }
    }
});

angular.module('xw.models').factory('User', function ($http, $localStorage) {
    // 这些变量作为更新购物车用
    // 最近一次添加至cart的时间
    var cartDate = Date.now();
    var timeSpan = 500;
    var timer = null;

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
        signup: function (mobile, pwd, code, couponcode) {
            var opts = {
                mobile: mobile,
                pwd: pwd,
                code: code
            };
            if (couponcode) {
                opts.couponcode = couponcode;
            }
            return $http.post('/api/user/signup', opts).then(function (res) {
                if (res.data && res.data.access_token) {
                    $localStorage.access_token = res.data.access_token;
                }

                return res;
            })
        },
        getSmsCode: function (mobile, type) {
            return $http.post('/api/user/sms', {
                mobile: mobile,
                type: type
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
        },
        updateUser: function (data) {
            return $http.put('/api/user', data)
        },
        resetPwd: function (mobile, pwd, code) {
            return $http.post('/api/user/resetpassword', {
                mobile: mobile,
                pwd: pwd,
                code: code
            });
        },
        postCart: function (cart) {
            var now = Date.now();
            if (now - cartDate > timeSpan) {
                clearTimeout(timer);
                $http.post('/api/user/shoppingcart', {shoppingCart: cart});
            } else {
                clearTimeout(timer);
                timer = setTimeout(this.postCart.bind(this, cart), timeSpan + 100)
            }
            cartDate = now;
        },
        applyInvitationCode: function (code) {
            return $http.get('/api/user/coupon/invitation/' + code)
        },
        invitedFriends: function () {
            return $http.get('/api/user/coupon/friends');
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

angular.module('xw.models').factory('Alipay', function ($http) {
    return {
        notify: function (id) {
            return $http.post('/api/orders/payment/alipay/mobile', {out_trade_no: id})
        }
    }
});

angular.module('xw.models').factory('Balance', function ($http, Debug) {
    return {
        balance: function () {
            return $http.get('/api/user/account')
        },
        chargeByCode: function (code) {
            return $http.post('/api/user/account/chargecode', {accountChargeCode: code});
        },
        balanceRecords: function () {
            return $http.get('/api/user/account/details?skip=0&limit=200')
                .catch(Debug.promiseErrFn('获取余额记录失败'))
        }
    }
})