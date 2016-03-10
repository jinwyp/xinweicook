angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Debug, User, $timeout,
                 $location, $q, Coupon, Weixin, Utils, Address) {
    $scope.user = null;
    $scope.address = '';
    $scope.addressLoaded = false;
    $scope.addresses = null;
    $scope.curDish = null; // 点击购买后被选中的菜品
    $scope.warehouse = ''; // 作为筛选菜品使用
    $scope.coupon = {
        expiringCount: 1,
        expiringDays: 0
    }
    $scope.css = {
        showCouponTip: false,
        couponDuration: 4500
    }
    var dishList = $scope.dishList = {}; // 将两个列表分开

    $scope.addDish = function (dish) {
        $scope.curDish = dish;
        if (!dish.count) {
            dish.count = 1;
        }
    };

    Utils.cleanLocalStorage();

    $scope.likeDish = function (dish) {
        Dishes.like(dish._id).then(function () {
            // 如果成功,并不是很有必要重新拉取用户列表.因为这里不会更新用户信息.
            dish.liked = !dish.liked;
        }).catch(Debug.promiseErrFn('更新用户喜欢状态失败'))
    };

    // for flash-class
    $scope.addressCount = 0;
    $scope.isAddressOk = function (isClick) {
        if (!$scope.address) {
            isClick && $scope.addressCount++;
            return false
        }
        if (!$scope.address.isAvailableForEat && $scope.path == '/eat') {
            isClick && $scope.addressCount++;
            return false;
        }

        return true;
    };

    var storage = $scope.storage = $localStorage;

    $scope.$on('$locationChangeStart', function () {
        $scope.path = $location.path();
        if ($scope.path == '/eat' && !$scope.dishList.eatList) {
            getDishList('ready to eat')
        }
        if ($scope.path == '/cook' && !$scope.dishList.cookList) {
            getDishList('ready to cook')
        }
    });

    $scope.outOfStock = function (dish) {
        if (dish.cookingType == 'ready to cook') {
            return dish.outOfStock
        } else {
            // 这里 <= 0 不是 !> 0
            return !(dish.stockWarehouseObj[$scope.warehouse] > 0)
        }
    }

    $scope.$watch('warehouse', function (val) {
        if (val) {
            filterEatByWarehouse()
        }
    });

    function init() {
        // 初始化nav
        var path = $location.path() || '/eat';
        if (path !== '/cook') path = '/eat';
        $location.path(path);
        $scope.path = path;

        Address.getList().then(function (res) {
            $scope.addresses = res.data;
            if (!$scope.addresses.length) return;

            // 选择了一个地址,将此作为默认地址
            if (storage.selectedAddress) {
                $scope.address = storage.selectedAddress;
                if (!$scope.address.isDefault) {
                    $scope.address.isDefault = true;
                    Address.update($scope.address).then(function () {
                        delete storage.selectedAddress;
                    });
                } else {
                    delete storage.selectedAddress;
                }
            } else {
                // 如果没有经过选择,则选择一个可配送默认地址
                res.data.some(function (addr) {
                    if (addr.isDefault) {
                        $scope.address = addr;
                        return true;
                    }
                });

                if (!$scope.address) {
                    $scope.address = $scope.addresses[0];
                }
            }

            // 保存warehouse到下单的时候需要,不过回到这个页面的时候会被cleanLocalStorage清除
            storage.warehouse = $scope.warehouse = $scope.address.warehouse;
            storage.orderAddress = $scope.address;

            filterEatByWarehouse();
        }).catch(angular.noop).then(function () {
            $scope.addressLoaded = true;
        });

        Weixin.getJsconfig().then(function (res) {
            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            })
        });
    }

    var type2name = {
        'ready to eat': 'eatList',
        'ready to cook': 'cookList'
    };

    function filterEatByWarehouse() {
        if (dishList.eatList && ($scope.warehouse == '56c41a9e632771df68dbae0b')) {
            dishList.eatList = dishList.eatList.filter(function (dish) {
                return dish.stockWarehouseNotPublished.indexOf($scope.warehouse) == -1
            });

            $timeout(function () {
                window.scrollTo(0, window.scrollY + 1);
            })
        }
    }

    function getDishList(type) {
        $q.all([
            // 获取订单列表
            Dishes.getList(type).then(function (res) {
                $scope.dishList[type2name[type]] = res.data;

                filterEatByWarehouse();
                return res.data;
            }),
            // 初始化user like list
            $scope.user ? $q.resolve($scope.user) :
                User.getUserInfo().then(function (res) {
                    // 如果是微信用户, 但是并没有获取到用户的微信信息, 则提示用户重新登录以获取用户信息
                    if (Weixin.isWeixin) {
                        if (!res.data.weixinId || !res.data.weixinId.openid) {
                            if (confirm('由于需要您的微信支付授权,否则将无法完成微信支付付款.重新登录并获取微信支付授权吗?')) {
                                User.logout().then(function () {
                                    location.href = '/mobile/login'
                                })
                            }
                        } else {
                            User.getWeixinUserInfo(res.data._id).then(function (res) {
                                if (res.data.subscribe) {
                                    var promotion = storage.promotion;
                                    if (promotion) {
                                        Coupon.exchangeCouponCode(promotion).then(function () {
                                            alert('扫二维码优惠券兑换成功!\n下订单时即可使用.');
                                            delete storage.promotion;
                                        })
                                    }
                                } else if (Weixin.isWeixin) {
                                    location.replace( '/mobile/wxgzh');
                                }
                            })
                        }
                    }

                    // 过滤优惠券
                    $scope.coupon = initCouponTip(res.data, new Date(res.headers('Date')))
                    if ($scope.coupon.expiringCount > 0) {
                        $scope.css.showCouponTip = true
                        $timeout(function () {
                            $scope.css.showCouponTip = false
                        }, $scope.css.couponDuration)
                    }

                    return $scope.user = res.data;
                })
        ]).then(function (results) {
            //初始化用户的喜好到菜品
            var dishLikeList = results[1].dishLikeList;
            results[0].forEach(function (dish) {
                dishLikeList.some(function (el) {
                    if (el._id == dish._id) {
                        return dish.liked = true;
                    }
                })
            })
        });
    }

    function initCouponTip(user, now) {
        var tips = []
        var oneDayTime = 24 * 60 * 60 * 1000
        var daySize = 3
        var ret = {
            expiringCount: 0,
            expiringDays: 0
        }
        user.couponList.filter(function (el) {
            return !el.isUsed && (new Date(el.endDate) > now)
        }).forEach(function (el) {
            var remain = Math.floor((new Date(el.endDate) - now) / oneDayTime)
            if (!tips[remain]) {
                tips[remain] = 1
            } else tips[remain]++
        })

        // todo:暂时只按照3天内,所有优惠券中最大天数的那个优惠券来显示,否则按照worktile上的方案来,看着有点傻
        // 例如: 1张1天内过期,1张2天内过期,那么显示2张2天内过期
        tips.slice(0, daySize).forEach(function (count, i) {
            if (count > 0) {
                ret.expiringDays = i
                ret.expiringCount += count
            }
        })

        return ret
    }

    init();
}

//# sourceMappingURL=eat-list.f584bf5e.js.map
