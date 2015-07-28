angular.module('xw.order').controller('orderCtrl', orderCtrl);

function orderCtrl($scope, $localStorage, Orders, User, Coupon) {
    $scope.cart = null;
    $scope.address = {
        province: '上海',
        city: '上海'
    };
    $scope.coupon = {};
    $scope.couponPrice = 0;
    $scope.couponLimitPrice = 0;
    $scope.deliveryFee = 5;

    $scope.back = function () {
        history.back();
    };

    $scope.cancelApplyCoupon = function () {
        $scope.coupon.code = '';
        $scope.couponPrice = 0;
        $scope.couponLimitPrice = 0;
    };

    $scope.$watch('coupon.code', function (newCode, oldCode) {
        if (newCode !== oldCode && /\w{10}/.test(newCode)) {
            $scope.couponPrice = 0;
            $scope.couponLimitPrice = 0;
            Coupon.getCouponInfo(newCode).then(function (res) {
                var coupon = res.data;
                var now = new Date(res.headers('date'));
                var startDate = new Date(coupon.startDate);
                var endDate = new Date(coupon.endDate);
                // todo: check price limit
                if (startDate <= now && now <= endDate) {
                    $scope.couponPrice = coupon.price;
                    $scope.couponLimitPrice = coupon.priceLimit;
                    $scope.coupon = coupon;
                }
            }).catch(function (res) {
                alert('无效的优惠代码');
            })
        }
    });

    $scope.orderPrice = function () {
        var price = 0;
        $scope.cart.forEach(function (dish) {
                price += dish.priceOriginal * dish.count
        });
        return price;
    };


    $scope.submitOrder = function ($event) {
        var order = {
            cookingType: 'ready to eat',
            clientFrom: 'website',
            freight: '5',
            payment: 'weixinpay',
            device_info: 'WEB',
            trade_type: 'JSAPI',
            credit: 0,
            spbill_create_ip: '8.8.8.8',
            paymentUsedCash: false
        };

        var check = {
            '联系信息无效': function () {
                var keys = [/*'geoLatitude', 'geoLongitude', */'province', 'city', 'district', 'street', 'address', 'contactPerson', 'mobile'];
                var valid = keys.every(function (key) {
                    return !!$scope.address[key];
                });
                if (valid) {
                    order.address = {};
                    keys.forEach(function (key) {
                        order.address[key] = $scope.address[key];
                    });
                }
                return valid;
            },

            '至少选择一个即食包': function () {
                    order.dishList = $scope.cart
                        .map(function (dish) {return {
                            dish: dish._id,
                            number: dish.count,
                            subDish: []
                        }});
                return true;
            },

            '获取配送时间失败,请稍后重试': function () {
                try {
                    var time = $scope.deliveryTime.selectTime.hour;
                    order.deliveryDateEat = time.substr(0, 10);
                    order.deliveryTimeEat = time.substr(11, 5);
                } catch (e){
                    return false;
                }

                return true;
            },

            '订单金额未满足优惠代码使用条件': function () {
                if (!$scope.couponPrice) return true;
                if ($scope.orderPrice() >= couponLimitPrice) {
                    order.promotionCode = $scope.coupon.code;
                    return true;
                } else return false;
            }
        };

        var ok = Object.keys(check).every(function (el) {
            var valid = check[el]();
            if (!valid) {
                alert(el);
            }
            return valid;
        });

        if (ok) {
            if (!$scope.orderSuccess) {
                $event.preventDefault();
                Orders.postOrder(order).then(function (res) {
                    $scope.orderSuccess = true;
                    $scope.wxstate = res.data._id;
                    alert('生成订单成功,点击按钮使用微信支付');
                    // todo: change btn text
                }).catch(function (res) {
                    alert('生成订单失败,请稍后再试');
                })
            } // 订单已生成, 跳转微信授权.
        } else {
            $event.preventDefault();
        }
    };



    function init() {
        if ($localStorage.cart) {
            $scope.cart = $localStorage.cart;
        } else {
            location.href = 'eat';
        }

        // todo : set fake address, to delete it later.

        Orders.deliveryTime({
            cookingType: "ready to eat",
            isCityShanghai: true,
            isInRange4KM: true
        }).then(function (res) {
            $scope.deliveryTime = res.data;
            $scope.deliveryTime.selectTime = res.data[0];
        }).catch(function (res) {
            console.log('get time error');
        });
        
        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
            $scope.address.mobile = $scope.user.mobile;
            $scope.address.contactPerson = $scope.user.username;
        })
    }

    init();
}
