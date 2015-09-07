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
    $scope.isWeixin = /MicroMessenger/i.test(navigator.userAgent);

    $scope.back = function () {
        history.back();
    };

    $scope.cancelApplyCoupon = function () {
        $scope.coupon.code = '';
        $scope.couponPrice = 0;
        $scope.couponLimitPrice = 0;
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
        var price = 0;
        Object.keys($scope.cart).forEach(function (name) {
            var list = $scope.cart[name];
            price += list.reduce(function price(total, cur) {
                total += cur.priceOriginal * cur.number;
                if (cur.subDish) {
                    total += cur.subDish.reduce(price, 0)
                }
                return total;
            }, 0)
        });
        return price;
    };


    $scope.submitOrder = function () {
        var order = {
            cookingType: $scope.dishList.cookList.length ? 'ready to cook' : 'ready to eat',
            clientFrom: $scope.isWeixin ? 'wechat' : 'mobileweb',
            freight: $scope.deliveryFee,
            payment:  $scope.isWeixin ? 'weixinpay' : 'alipay direct',
            device_info: 'WEB',
            trade_type: 'JSAPI',
            credit: 0,
            spbill_create_ip: '8.8.8.8',
            paymentUsedCash: false,
            userComment: $scope.userComment || ''
        };

        var check = {
            '联系信息无效': function () {
                var keys = ['geoLatitude', 'geoLongitude', 'province', 'city',
                    'district', 'street', 'address', 'contactPerson', 'mobile'];
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

            '联系人姓名不能少于2个字符': function () {
                return !$scope.address.contactPerson || $scope.address.contactPerson.length >= 2
            },

            '至少选择一个即食包': function () {
                order.dishList = [];
                Object.keys($scope.cart).forEach(function (name) {
                    var list = $scope.cart[name];
                    list.forEach(function (dish) {
                        order.dishList.push({
                            dish: dish.dish,
                            number: dish.number,
                            subDish: dish.subDish || []
                        })
                    })
                });
                return true;
            },

            '获取配送时间失败,请稍后重试': function () {
                try {
                    if ($scope.eatTime) {
                        var time = $scope.eatTime.selectTime.hour;
                        order.deliveryDateEat = time.substr(0, 10);
                        order.deliveryTimeEat = time.substr(11, 5);
                    }
                    if ($scope.cookTime) {
                        order.deliveryDateCook = $scope.cookTime.selectDay.day;
                        if ($scope.cookTime.selectTime) {
                            order.deliveryTimeCook = $scope.cookTime.selectTime.name + ':00';
                        } else {
                            order.deliveryTimeCook = '12:00';
                        }
                    }
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
                clearAddress();

                $scope.orderSuccess = true;
                $scope.wxstate = res.data._id;
                $scope.alipayLink = res.data.aliPaySign.fullurl;

                setTimeout(function () {
                    var selector = '#weixinPay';
                    var weixinId = $scope.user.weixinId;
                    //if (weixinId && weixinId.openid) {
                    //    selector = '#directPay';
                    //}
                    if (!$scope.isWeixin) {
                        selector = '#alipayPay';
                        document.querySelector(selector).click();
                        return;
                    }
                    location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx37a1323e488cef84&' +
                        'redirect_uri=http%3A%2F%2Fm.xinweicook.com%2Fapi%2Forders%2Fpayment%2Fweixinpay%2Fopenid&' +
                        'response_type=code&scope=snsapi_base&' +
                        'state=' + $scope.wxstate +
                        '#wechat_redirect'
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

    function clearAddress() {
        delete $localStorage.isInRange4KM;
        delete $localStorage.address;
    }



    function init() {
        var isCityShanghai = false;

        if ($localStorage.cart) {
            $scope.cart = $localStorage.cart;
            $scope.subDishCart = [];
            $scope.dishList = {cookList:[], eatList:[]};
            Object.keys($scope.dishList).forEach(function (name) {
                $scope.cart[name].forEach(function (dish) {
                    if (dish.subDish) {
                        dish.subDish.forEach(function (el) {
                            $scope.dishList[name].push({
                                title: {zh: dish.title.zh + '(' + el.title.zh + ')'},
                                number: el.number,
                                priceOriginal: dish.priceOriginal + el.priceOriginal
                            })
                        })
                    } else {
                        $scope.dishList[name].push(dish);
                    }
                })
            });
        } else {
            //todo:
            location.href = '/mobile';
        }

        if ($localStorage.address) {
            $scope.address = $localStorage.address;
            isCityShanghai = $scope.address.city.indexOf('上海') != -1;

            $scope.deliveryFee = 0;
            if ($scope.dishList.cookList.length) {
                if (isCityShanghai) $scope.deliveryFee = 5;
                else if (/浙江|江苏|安徽/.test($scope.address.province)) {
                    $scope.deliveryFee = 12;
                } else $scope.deliveryFee = 24;
            }

            if ($scope.dishList.eatList.length) {
                $scope.deliveryFee += 5;
            }
        }

        //  因为每次都会删掉localStorage的地址,所以无法进入同一张订单页
        if (!$scope.address.district) {
            //todo:
            location.href = '/mobile/';
        }

        $scope.dishList.eatList.length && Orders.deliveryTime({
            cookingType: "ready to eat",
            isCityShanghai: isCityShanghai,
            isInRange4KM: $localStorage.isInRange4KM || false
        }).then(function (res) {
            $scope.eatTime = res.data;
            $scope.eatTime.selectTime = res.data[0];
        });

        $scope.dishList.cookList.length && Orders.deliveryTime({
            cookingType: "ready to cook",
            isCityShanghai: isCityShanghai,
            isInRange4KM: $localStorage.isInRange4KM || false
        }).then(function (res) {
            $scope.cookTime = res.data;
            $scope.cookTime.selectDay = res.data[0];
            if ($scope.cookTime.selectDay.segment) {
                $scope.cookTime.selectTime = $scope.cookTime.selectDay.segment[0];
            }
        });
        
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
