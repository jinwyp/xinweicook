angular.module('xw.controllers').controller('orderCtrl', orderCtrl);

function orderCtrl($scope, $localStorage, Orders, User, Coupon, Alert) {
    $scope.cart = null;
    $scope.subDishCart = null;
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
        $scope.coupon.code2 = '';
    };

    $scope.$watch('coupon.code', function (newCode, oldCode) {
        if (newCode !== oldCode && /^\w{8}(\w{2})?$/.test(newCode)) {
            $scope.couponPrice = 0;
            $scope.couponLimitPrice = 0;
            var sendCode = newCode;
            if (newCode.length == 8) sendCode = 'zz' + newCode;
            Coupon.getCouponInfo(sendCode).then(function (res) {
                var coupon = res.data;
                var now = new Date(res.headers('date'));
                var startDate = new Date(coupon.startDate);
                var endDate = new Date(coupon.endDate);
                // todo: check price limit
                if (startDate <= now && now <= endDate) {
                    $scope.couponPrice = coupon.price;
                    $scope.couponLimitPrice = coupon.priceLimit;
                    $scope.coupon = coupon;
                    $scope.coupon.code = newCode;
                }
            }).catch(function (res) {
                alert('无效的优惠代码');
            })
        }
    });

    $scope.orderPrice = function () {
        //var price = 0;
        //$scope.cart.forEach(function (dish) {
        //        price += dish.priceOriginal * dish.count
        //});
        //return price;
        return $scope.cart.reduce(function price(total, cur) {
            total += cur.priceOriginal * cur.number;
            if (cur.subDish) {
                total += cur.subDish.reduce(price, 0)
            }
            return total;
        }, 0).toFixed(1);
    };


    $scope.submitOrder = function () {
        var order = {
            cookingType: 'ready to eat',
            clientFrom: 'wechat',
            freight: 5,
            payment: 'weixinpay',
            device_info: 'WEB',
            trade_type: 'JSAPI',
            credit: 0,
            spbill_create_ip: '8.8.8.8',
            paymentUsedCash: false,
            userComment: $scope.userComment || ''
        };

        var check = {
            '联系信息无效': function () {
                var keys = ['geoLatitude', 'geoLongitude', 'province', 'city', 'district', 'street', 'address', 'contactPerson', 'mobile'];
                var valid = keys.every(function (key) {
                    return !!$scope.address[key];
                });
                if (valid) {
                    order.address = {distanceFrom: +$localStorage.distance};
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
                            number: dish.number,
                            subDish: dish.subDish || [] //todo: 多出来的属性不影响吗?
                        }});
                return true;
            },

            '然而只点饮料并不能配送!': function () {
                var onlyDrink = $scope.cart.every(function (dish) {
                    return dish.sideDishType == 'drink'
                });
                return !onlyDrink
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
                if ($scope.coupon.code2) {
                    order.coupon = $scope.coupon.code2._id;
                }
                if (!$scope.couponPrice) return true;
                if ($scope.orderPrice() >= $scope.couponLimitPrice) {
                    order.promotionCode = $scope.coupon.code;
                    if (order.promotionCode.length == 8) {
                        order.promotionCode = 'zz' + order.promotionCode;
                    }
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
            Orders.postOrder(order).then(function (res) {
                $scope.orderSuccess = true;
                $scope.wxstate = res.data._id;

                setTimeout(function () {
                    document.querySelector('.confirm-button.form-control').click();
                }, 200);
                // todo: change btn text
            }).catch(function (res) {
                var msg = Alert.message(res.data.validationStatus);
                if (res.data.validationStatus == 4110) {
                    if (/Dish Out Of Stock ! \w+ ([\w\u4E00-\u9FA5]+) /) {
                        alert(RegExp.$1 + msg);
                        return;
                    }
                    alert(msg);
                    return;
                }
                alert('生成订单失败,请稍后再试');
            })
        }
    };



    function init() {
        var isCityShanghai = false;

        if ($localStorage.cart) {
            $scope.cart = $localStorage.cart;
            $scope.subDishCart = [];
            $scope.cart.forEach(function (dish) {
                if (dish.subDish) {
                    dish.subDish.forEach(function (el) {
                        $scope.subDishCart.push({
                            title: {zh: dish.title.zh + '(' + el.title.zh + ')'},
                            number: el.number,
                            priceOriginal: dish.priceOriginal + el.priceOriginal
                        })
                    })
                } else {
                    $scope.subDishCart.push(dish)
                }
            })
        } else {
            //todo:
            location.href = '/mobile';
        }

        if ($localStorage.address) {
            $scope.address = $localStorage.address;
            isCityShanghai = $scope.address.city.indexOf('上海') != -1;
            delete $localStorage.address;
        }

        if (!$scope.address.district) {
            //todo:
            location.href = '/mobile/';
        }

        Orders.deliveryTime({
            cookingType: "ready to eat",
            isCityShanghai: isCityShanghai,
            isInRange4KM: $localStorage.isInRange4KM || false
        }).then(function (res) {
            $scope.deliveryTime = res.data;
            $scope.deliveryTime.selectTime = res.data[0];
        }).catch(function (res) {
            console.log('get time error');
        });

        delete $localStorage.isInRange4KM;
        
        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
            if ($scope.user.couponList) {
                $scope.user.couponList = $scope.user.couponList.filter(function (el) {
                    return !el.isUsed;
                })
            }
            //$scope.address.mobile = $scope.user.mobile;
            //$scope.address.contactPerson = $scope.user.username;
        })
    }

    init();
}
