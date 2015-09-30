angular.module('xw.controllers').controller('orderPayCtrl', function ($scope, $localStorage, Orders, User, Balance) {
    // 此类变量在被重新赋予新值较为麻烦,需要cart = data.cart = ..
    var cart, address, time, coupon;
    var data = $scope.data = {
        cart: null,
        address: null,
        time: {},
        coupon: {},
        balance: {}
    };

    var model = $scope.model = {
        time: {},
        coupon: {}
    };

    function init() {
        var isCityShanghai;

        // 购物车
        cart = data.cart = $localStorage.confirmedCart;
        if (!cart) return;

        // 地址
        address = data.address = $localStorage.orderAddress;
        isCityShanghai = address.province.indexOf('上海') != -1;

        // 配送时间
        time = data.time;
        cart.eatList && cart.eatList.length && Orders.deliveryTime({
            cookingType: "ready to eat",
            isCityShanghai: isCityShanghai,
            isInRange4KM: address.isInRange || false
        }).then(function (res) {
            time.eat = res.data;
            model.time.eat = res.data[0];
        });
        cart.cookList && cart.cookList.length && Orders.deliveryTime({
            cookingType: "ready to cook",
            isCityShanghai: isCityShanghai,
            isInRange4KM: address.isInRange || false
        }).then(function (res) {
            time.cook = res.data;
            model.time.cook = {day: res.data[0]};
            if (model.time.cook.day.segment) {
                model.time.cook.time = model.time.cook.day.segment[0];
            }
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
            data.balance.enabled = true;
        });

    }

    init();

    function clear() {

    }
})