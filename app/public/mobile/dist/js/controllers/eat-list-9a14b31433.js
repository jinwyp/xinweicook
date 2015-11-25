angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Debug, User, $timeout,
                 ScopeDecorator, $location, $q, Coupon, Weixin, Utils, Address) {
    $scope.user = null;
    $scope.address = '';
    $scope.addressLoaded = false;
    $scope.addresses = null;
    $scope.curDish = null; // 点击购买后被选中的菜品
    $scope.warehouse = ''; // 作为筛选菜品使用
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
            getDishList('caohejing1', 'ready to eat')
        }
        if ($scope.path == '/cook' && !$scope.dishList.cookList) {
            getDishList('caohejing1', 'ready to cook')
        }
    });

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
                $scope.address.isDefault = true;
                Address.update($scope.address).then(function () {
                    delete storage.selectedAddress;
                });
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
        if (dishList.eatList && $scope.warehouse) {
            dishList.eatList = dishList.eatList.filter(function (dish) {
                return dish.stockWarehouseObj[$scope.warehouse] > 0
                    || dish.cookingType == 'ready to cook'
            });

            $timeout(function () {
                window.scrollTo(0, window.scrollY + 1);
            })
        }
    }

    function getDishList(warehouse, type) {
        $q.all([
            // 获取订单列表
            Dishes.getList(warehouse, type).then(function (res) {
                $scope.dishList[type2name[type]] = res.data;

                filterEatByWarehouse();
                return res.data;
            }),
            // 初始化user like list
            $scope.user ? $q.resolve($scope.user) :
                User.getUserInfo().then(function (res) {
                var promotion = storage.promotion;
                if (promotion) {
                    User.getWeixinUserInfo(res.data._id).then(function (res) {
                        if (res.data.subscribe) {
                            Coupon.exchangeCouponCode(promotion).then(function () {
                                alert('扫二维码优惠券兑换成功!\n下订单时即可使用.');
                                delete storage.promotion;
                            })
                        } else location.replace( '/mobile/wxgzh');
                    })
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

    init();
}