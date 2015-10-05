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
        },

        /**
         * 将传入的dish转换成另外一种预定义的形式.todo:filter更合适??但是filter似乎不适合做过多的数据处理,会影响速度
         * @param iDish - 输入的dish,对象或数组
         * @param tType - 目标类型
         * @param sType - 原类型
         * @returns {Object|Array} 返回dish对象或dish数组,视输入的dish类型而定
         */
        transform: function (iDish, tType, sType) {

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
        login: function (username, password, couponcode) {
            var args = {
                username: username,
                password: password,
                grant_type: 'password'
            };
            if (couponcode) args.couponcode = couponcode;
            return $http.post('/api/user/token', args).then(function (res) {
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
                return $http.post('/api/user/shoppingcart', {shoppingCart: cart});
            } else {
                clearTimeout(timer);
                timer = setTimeout(this.postCart.bind(this, cart), timeSpan + 100)
            }
            cartDate = now;
            return {'catch': angular.noop}
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
        notify: function (id, isCharge) {
            var url = isCharge ? '/api/orders/payment/alipay/notify/account'
                : '/api/orders/payment/alipay/mobile';
            return $http.post(url, {out_trade_no: id})
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
        chargeOnline: function (data) {
            return $http.post('/api/user/account/details', data);
        },
        balanceRecords: function () {
            return $http.get('/api/user/account/details?skip=0&limit=200')
                .catch(Debug.promiseErrFn('获取余额记录失败'))
        }
    }
})