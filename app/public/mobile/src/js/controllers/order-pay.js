angular.module('xw.controllers').controller('orderPayCtrl', function (Alert, $scope, $localStorage, Orders, User, Balance, Weixin, $filter) {
    // 此类变量在被重新赋予新值较为麻烦,需要cart = data.cart = ..
    var cart, address, time, coupon;
    var data = $scope.data = {
        cart: null,
        address: null,
        time: {},
        coupon: {},
        balance: {},
        deliveryFee: 0,
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
        cart = data.cart = $localStorage.confirmedCart;
        if (!cart) return;

        // 地址
        address = data.address = $localStorage.orderAddress;
        isCityShanghai = address.province.indexOf('上海') != -1;
        isNearAddress = /浙江|江苏|安徽/.test(address.province);
        address.distanceFrom = +address.distance;

        // 配送费用
        if (cart.cookList && cart.cookList.length)
            data.deliveryFee = isCityShanghai ? 6 : isNearAddress ? 12 : 24;
        if (cart.eatList && cart.eatList.length) data.deliveryFee += 6;

        // 配送时间
        time = data.time;
        cart.eatList && cart.eatList.length && Orders.deliveryTime({
            cookingType: "ready to eat",
            isCityShanghai: isCityShanghai,
            isInRange4KM: address.isInRange || false
        }).then(function (res) {
            time.eat = $filter('eatTimeOptions')(res.data);
            model.time.eat = time.eat[0];
        });
        cart.cookList && cart.cookList.length && Orders.deliveryTime({
            cookingType: "ready to cook",
            isCityShanghai: isCityShanghai,
            isInRange4KM: address.isInRange || false
        }).then(function (res) {
            time.cook = $filter('cookTimeOptions')(res.data);
            model.time.cook = {day: time.cook[0]};
        });

        // 购物车处理
        for (var name in cart) {
            if (!cart[name].length) delete cart[name];
        }

        // 优惠券
        coupon = data.coupon;
        User.getUserInfo().then(function (res) {
            coupon.cardList = res.data.couponList.filter(function (el) {
                return !el.isUsed;
            });
            if (coupon.cardList.length) {
                model.coupon.card = coupon.cardList.sort(function (a, b) {
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
        for (var name in cart) {
            var list = cart[name];
            data.orderPrice += list.reduce(function (total, cur) {
                var subDishPrice = cur.subDish ? cur.subDish.priceOriginal : 0;
                return total + (cur.dish.priceOriginal + subDishPrice)
                    * cur.dish.number;
            }, 0)
        }

        // 未减优惠余额前的总金额
        data.totalPrice = data.orderPrice + data.deliveryFee;
    }

    $scope.couponPrice = function () {
        var price = 0;
        price += model.coupon.card ? model.coupon.card.price : 0;
        return price + (data.coupon.codePrice || 0); // codePrice由异步校验指令赋值
    };

    $scope.usedBalance = function () {
        var balance = data.balance;
        if (!balance.total || !balance.enabled) return 0;

        var remainPrice = data.totalPrice - $scope.couponPrice();
        remainPrice = balance.total <= remainPrice ? balance.total : remainPrice;
        return remainPrice < 0 ? 0 : remainPrice;
    };

    $scope.payPrice = function () {
        var usedBalance = $scope.usedBalance();
        var payPrice = data.totalPrice - $scope.couponPrice() - usedBalance;
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

    var isSubmitting = false;
    $scope.order = function (form) {
        if (form.$invalid || !isTimeValid()) return;
        if (isSubmitting) return;

        isSubmitting = true;
        // 设置order对象参数
        var clientFrom = isWeixin && $scope.payPrice() > 0 ? 'wechat' : 'mobileweb';
        var payment = $scope.payment();
        var cookingType = cart.cookList && cart.cookList.length ?
            'ready to cook' : 'ready to eat';

        // 设置order对象
        var order = {
            cookingType: cookingType,
            clientFrom: clientFrom,
            freight: data.deliveryFee,
            payment: payment,
            device_info: 'WEB',
            trade_type: 'JSAPI',
            usedAccountBalance: !!$scope.usedBalance(),
            credit: 0,
            spbill_create_ip: '8.8.8.8',
            paymentUsedCash: false,
            userComment: model.userComment
        };

        angular.extend(order, {address: address},
            $filter('dishes')(cart, 'order', 'displayCart'),
            $filter('orderTime')(model.time, 'all'),
            $filter('coupon')(model.coupon)
        );

        Orders.postOrder(order).then(function (res) {
            // todo: clear some locals to prevent from reordering.
            clear();

            // use setTimeout for clearing locals
            setTimeout(function () {
                if (payment == 'account balance') {
                    alert('支付成功');
                    location.href = '/mobile/invite';
                }

                if (payment == 'weixinpay')
                    location.href = Weixin.oauthUrl + res.data._id;

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
        if (time.eat && (model.time.eat == time.eat[0])) {
            valid = false;
        }
        if (time.cook && model.time.cook.day == time.cook[0].day) {
            valid = false;
        }
        if (!valid) alert('请选择配送时间');
        return valid;
    }

    function clear() {
        //delete $localStorage.confirmedCart;
        delete $localStorage.addDishCart;
    }
});