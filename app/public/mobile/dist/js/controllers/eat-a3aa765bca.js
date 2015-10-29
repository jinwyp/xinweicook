angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Debug, User, $timeout, ScopeDecorator, $location, $q, Coupon) {
    $scope.cart = [];
    $scope.user = null;
    $scope.address = '';
    $scope.curDish = null; // 点击购买后被选中的菜品

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

        $q.all([
            Dishes.getList().then(function (res) {
                $scope.dishes = res.data;
                return true;
            }),
            User.getUserInfo().then(function (res) {
                var promotion = $localStorage.promotion;
                if (promotion) {
                    alert('call getWeixinUserInfo');
                    User.getWeixinUserInfo().then(function (res) {
                        if (res.data.subscribe) {
                            Coupon.exchangeCouponCode(promotion).then(function () {
                                delete $localStorage.promotion;
                            })
                        } else location.replace('/mobile/wxgzh');
                    }).catch(function () {
                        alert('getWeixinUserInfo failed');
                    })
                }

                $scope.allAddresses = res.data.address;
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
