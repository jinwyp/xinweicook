angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Debug, User, $timeout, Map,
                 ScopeDecorator, $location, $q, Coupon, Weixin) {
    $scope.cart = [];
    $scope.user = null;
    $scope.address = '';
    $scope.curDish = null; // 点击购买后被选中的菜品
    $scope.warehouseFilter = '!caohejing1';

    $scope.addDish = function (dish) {
        $scope.curDish = dish;
        if (!dish.count) {
            dish.count = 1;
        }
    };

    $scope.goToCart = function () {
        if (!$scope.cart.length) {
            alert('请至少添加一份菜品');
            return;
        }
        $timeout(function () {
            location.href = 'cart';// todo: replace with route
        }, 200); // let $localStorage sync. but
    };

    $scope.likeDish = function (dish) {
        Dishes.like(dish._id).then(function (res) {
            // 如果成功,并不是很有必要重新拉取用户列表.因为这里不会更新用户信息.
            dish.liked = !dish.liked;
        }).catch(Debug.promiseErrFn('更新用户喜欢状态失败'))
    };

    ScopeDecorator.nav($scope);


    function init() {
        // 初始化nav
        var path = $location.path() || '/eat';
        if (path !== '/cook') path = '/eat';
        $location.path(path);
        $scope.path = path;

        $localStorage.warehouse = 'xinweioffice';

        // todo: just for now.
        Dishes.getList('caohejing1').then(function (res) {
            $scope.dishes = res.data;
            if (!Weixin.isWeixin) {
                $scope.warehouseFilter = '!caohejing1';
            }
        });

        getDishList('caohejing1');

        Weixin.ready(function () {
            Weixin.getLocation(function (res) {
                var warehouse = Map.nearestWarehouse(res.latitude,
                    res.longitude);
                $localStorage.warehouse = warehouse;

                if (warehouse == 'caohejing1') {
                    $scope.warehouseFilter = 'caohejing1'
                } else {
                    $scope.warehouseFilter = '!caohejing1'
                }
            }, function () {
                $scope.warehouseFilter = '!caohejing1'
            })
        });

        Weixin.getJsconfig().then(function (res) {
            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            })
        });

        //!Weixin.isWeixin && getDishList($localStorage.warehouse);
    }

    function getDishList(warehouse) {
        $q.all([
            Dishes.getList(warehouse).then(function (res) {
                return $scope.dishes = res.data;
            }),
            User.getUserInfo().then(function (res) {
                var promotion = $localStorage.promotion;
                if (promotion) {
                    User.getWeixinUserInfo(res.data._id).then(function (res) {
                        if (res.data.subscribe) {
                            Coupon.exchangeCouponCode(promotion).then(function () {
                                alert('扫二维码优惠券兑换成功!\n下订单时即可使用.');
                                delete $localStorage.promotion;
                            })
                        } else location.replace('/mobile/wxgzh');
                    })
                }

                return $scope.user = res.data;
            })
        ]).then(function (results) {
            //初始化用户的喜好到菜品
            var dishLikeList = results[1].dishLikeList;
            $scope.dishes.forEach(function (dish) {
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