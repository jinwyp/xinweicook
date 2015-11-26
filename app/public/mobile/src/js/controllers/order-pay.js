angular.module('xw.controllers').controller('orderPayCtrl', function (Alert, $scope, $localStorage, Orders, User, Balance, Weixin, $filter, Utils) {
    // 此类变量在被重新赋予新值较为麻烦,需要cart = data.cart = ..
    var cart, address, time, coupon;
    var data = $scope.data = {
        cart: null,
        address: null,
        time: {},
        coupon: {},
        balance: {},
        freight: 6,
        orderPrice: 0,
        payment: {
            weixinpay: '微信支付',
            'alipay direct': '支付宝支付',
            'account balance': '余额支付'
        }
    };

    var model = $scope.model = {
        time: {},
        coupon: {},
        userComment: ''
    };
    
    var isWeixin = $scope.isWeixin = Weixin.isWeixin;

    function init() {
        var isCityShanghai, isNearAddress;

        // 购物车
        cart = data.cart = $localStorage.confirmedBag;
        if (!cart) {
            location.href = '/mobile';
            return;
        }

        // 地址
        address = data.address = $localStorage.orderAddress;
        isCityShanghai = address.province.indexOf('上海') != -1;
        isNearAddress = /浙江|江苏|安徽/.test(address.province);

        // 配送费用
        Orders.price(orderData('freight')).then(function (res) {
            data.freight = res.data.freight;
        });

        // 配送时间
        time = data.time;
        cart.eatList && cart.eatList.length && Orders.deliveryEatTime({
            _id: $localStorage.warehouse
        }).then(function (res) {
            time.eat = res.data.timeList;
        });
        cart.cookList && cart.cookList.length && Orders.deliveryTime({
            cookingType: "ready to cook",
            isCityShanghai: isCityShanghai,
            isInRange4KM: address.isAvailableForEat
        }).then(function (res) {
            time.cook = $filter('cookTimeUnion')(res.data);
            //model.time.cook = {day: time.cook[0]};
        });

        // 购物车处理
        for (var name in cart) {
            if (!cart[name].length) delete cart[name];
        }

        // 优惠券
        coupon = data.coupon;
        User.getUserInfo().then(function (res) {
            coupon.cardList = res.data.couponList.filter(function (el) {
                var startDate = new Date(el.startDate);
                var endDate = new Date(el.endDate);
                var now = Date.now();

                return !el.isUsed && (startDate < now && endDate > now);
            });
            if (coupon.cardList.length) {
                model.coupon.card = angular.sort(coupon.cardList, function (a, b) {
                    return b.price - a.price
                })[0];
            }
        });

        // 余额
        Balance.balance().then(function (res) {
            data.balance.total = res.data.balance;
            data.balance.enabled = !!res.data.balance;
        });

        // 订单金额(不含运费) 应该独立出去
        var dishPrice = $filter('dishPrice');
        for (var name in cart) {
            var list = cart[name];
            data.orderPrice += list.reduce(function (total, cur) {
                return total + dishPrice(cur, true)
            }, 0)
        }
    }

    $scope.totalPrice = function () {
        return data.orderPrice + data.freight;
    };

    $scope.couponPrice = function () {
        var price = 0;
        price += model.coupon.card ? model.coupon.card.price : 0;
        return price + (data.coupon.codePrice || 0); // codePrice由异步校验指令赋值
    };

    $scope.usedBalance = function () {
        var balance = data.balance;
        if (!balance.total || !balance.enabled) return 0;

        var remainPrice = $scope.totalPrice() - $scope.couponPrice();
        remainPrice = balance.total <= remainPrice ? balance.total : remainPrice;
        return remainPrice < 0 ? 0 : remainPrice;
    };

    $scope.payPrice = function () {
        var usedBalance = $scope.usedBalance();
        var payPrice = $scope.totalPrice() - $scope.couponPrice() - usedBalance;
        if (payPrice <= 0) {
            // 当价格小于等于0时, 如果计算出的使用余额为0(即优惠券已够用无需用余额), 则需要用户支付0.1
            payPrice = usedBalance ? 0 : 0.1
        }
        return payPrice;
    };

    $scope.payment = function (isHtml) {
        var payment = $scope.isWeixin ? 'weixinpay' : 'alipay direct';
        payment = $scope.payPrice() == 0 ? 'account balance' : payment;
        payment = isHtml ? data.payment[payment] : payment;
        return payment
    };

    /**
     * 获取提交订单或计算运费的对象
     * @param type 如果type为freight,则为计算运费需要的对象.
     * @returns {*}
     */
    function orderData(type) {
        if (!orderData._data) {
            orderData._data = {
                cookingType:  cart.cookList && cart.cookList.length
                    ? 'ready to cook' : 'ready to eat',
                addressId: $localStorage.orderAddress._id
            };
            angular.extend(orderData._data, $filter('dishes')(cart, 'order', 'displayCart'))
        }
        if (!orderData.dishes) {
            orderData.dishes = $filter('dishes');
        }
        if (!orderData.orderTime) {
            orderData.orderTime = $filter('orderTime');
        }
        if (!orderData.coupon) {
            orderData.coupon = $filter('coupon')
        }

        var order = angular.copy(orderData._data);
        order.clientFrom = isWeixin && $scope.payPrice() > 0 ? 'wechat' : 'mobileweb';
        order.usedAccountBalance = !!$scope.usedBalance();
        angular.extend(order, orderData.coupon(model.coupon));

        if (type != 'freight') {
            angular.extend(order, {
                freight: data.freight,
                payment: $scope.payment(),
                device_info: 'WEB',
                trade_type: 'JSAPI',
                credit: 0,
                spbill_create_ip: '8.8.8.8',
                paymentUsedCash: false,
                userComment: model.userComment
            })
        }

        return order;
    }

    var isSubmitting = false;
    $scope.order = function (form) {
        if (!isTimeValid() || form.$invalid) return;
        if (isSubmitting) return;

        isSubmitting = true;
        // 设置order对象参数
        var order = orderData();

        Orders.postOrder(order).then(function (res) {
            // todo: clear some locals to prevent from reordering.
            clear();

            // use setTimeout for clearing locals
            setTimeout(function () {
                if (payment == 'account balance') {
                    alert('支付成功');
                    location.replace('/mobile/invite')
                }

                if (payment == 'weixinpay')
                    location.href = '/mobile/wxpay/' + res.data._id;

                if (payment == 'alipay direct')
                    location.href = res.data.aliPaySign.fullurl;
            }, 150)
        }).catch(function (res) {
            isSubmitting = false;
            var tip = Alert.message(res.data.validationStatus);
            var message = res.data.message;
            if (res.data.validationStatus == 4110) {
                if (/Dish Out Of Stock ! \w+ ([\w\u4E00-\u9FA5]+)/.
                        test(message)) {
                    alert(RegExp.$1 + tip);
                    return;
                }
                alert(tip);
                return;
            }
            alert('生成订单失败,请稍后再试');
        })

    };

    init();

    function isTimeValid() {
        var valid = true;
        if (time.eat && !model.time.eat) {
            alert('请选择便当配送时间');
            valid = false;
        }
        if (time.cook && !model.time.cook) {
            alert('请选择食材包配送时间');
            valid = false;
        }
        return valid;
    }

    function clear() {
        delete $localStorage.confirmedBag;
        var localBag = $localStorage.localBag;
        if (!localBag) return;
        for (var key in cart) {
            var list = cart[key];
            list.forEach(function (item1) {
                for (var i = 0; i < localBag.length; i++) {
                    if (Utils.isSameItemInCart(item1, localBag[i])) {
                        localBag.splice(i--, 1);
                    }
                }
            })
        }
    }
});