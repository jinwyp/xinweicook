angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Weixin, Debug, User, Map, $timeout, ScopeDecorator, $location, $q) {
    $scope.cart = null;
    $scope.address = '';
    $scope.curDish = null; // 点击购买后被选中的菜品
    $scope.css = {
        showAllAddress: false,
        showLocationFailed: false
    };

    $scope.hide = function () {
        $scope.curDish = null;
    };

    $scope.addDish = function (dish) {
        $scope.curDish = dish;
        if (!dish.count) {
            dish.count = 1;
        }
    };
    
    $scope.addToCart = function (dish) {
        var selection = dish.curSelection;
        var exist;

        // 若菜品有多属性则进行如下选择
        if (selection) {
            dish.subDish = dish.subDish || [];

            Object.keys(selection).forEach(function (propertyName) {
                var item = selection[propertyName];

                // 检查dish的subDish中是否存在curSelection
                //  如果有, 则增加相应数量,
                //  如果没有, 则添加curSelection到subDish
                exist = dish.subDish.some(function (el) {
                    // el.dish为id
                    if (el.dish == item._id) {
                        el.number += dish.count;
                        return true;
                    }
                });

                if (!exist) {
                    dish.subDish.push({
                        dish: item._id,
                        number: dish.count,
                        title: item.title,
                        priceOriginal: item.priceOriginal
                    })
                }
            })
        }

        // 检查cart中是否存在dish
        //  如果有, 则增加相应数量,
        //  如果没有, 则添加到cart中
        exist = $scope.cart.some(function (el) {
            if (el._id == dish._id) {
                el.number += dish.count;
                return true;
            }
        });

        if (!exist) {
            dish.number = dish.count;
            $scope.cart.push(dish);
        }

        dish.count = 0;

        $scope.hide();

        User.postCart($scope.cart.map(function (dish) {
            return {
                dish: dish._id,
                number: dish.number,
                subDish: dish.subDish || []
            }
        }))
    };

    $scope.totalPrice = function () {
        var p = $scope.cart.reduce(function price(total, cur) {
            total += cur.priceOriginal * cur.number;
            if (cur.subDish) {
                total += cur.subDish.reduce(price, 0)
            }
            return total;
        }, 0);
        if (!$scope.curDish) return p;
        return p + $scope.curDish.count *
            ($scope.curDish.priceOriginal +
            (!$scope.curDish.curSelection ? 0 :
                Object.keys($scope.curDish.curSelection).reduce(function (_p, name) {
                    return _p + $scope.curDish.curSelection[name].priceOriginal
                }, 0))
            )
    };

    $scope.makeOrder = function () {
        var itemCount = $scope.cart.reduce(function (count, el) {
            return count + el.number;
        }, 0);
        if (itemCount < 2) {
            alert('亲, 我们的即食包是2份起送哦, 请再添加一份吧!');
            return;
        }
        if (typeof $scope.isInRange !== 'undefined') {
            if (!$scope.isInRange) {
                alert('抱歉, 当前地址不在我们配送范围之内.');
                return;
            }
        } else {
            alert('正在计算配送距离,请稍后重试');
            return
        }
        $timeout(function () {
            location.href = 'cart';// todo: replace with route
        }, 200); // let $localStorage sync. but
    };

    $scope.chooseAddress = function (addr) {
        $scope.address = addr;
        $localStorage.address = addr;

        delete $scope.isInRange;
        delete $localStorage.isInRange4KM;

        Map.distance(addr.geoLatitude, addr.geoLongitude).then(function (data) {
            $scope.isInRange = $localStorage.isInRange4KM = !!data.isInRange;
            $localStorage.distance = data.distance;

            Debug.alert('与xw的步行距离:' + data.distance);
        });
    };

    $scope.isRangeValid = function () {
        if (typeof $scope.isInRange !== 'undefined') {
            return $scope.isInRange;
        } else {
            alert('正在计算距离,请稍后');
            return false
        }
    };

    $scope.likeDish = function (dish) {
        Dishes.like(dish._id).then(function (res) {
            // 如果成功,并不是很有必要重新拉取用户列表.因为这里不会更新用户信息.
            dish.liked = !dish.liked;
        }).catch(Debug.promiseErrFn('更新用户喜欢状态失败'))
    };

    ScopeDecorator.nav($scope);




    function init() {
        // 初始化选择的地址
        if ($localStorage.selectedAddress) {
            $scope.chooseAddress($localStorage.selectedAddress);
            delete $localStorage.selectedAddress;
        }

        // 初始化nav
        var path = $location.path() || '/eat';
        $location.path(path);
        $scope.path = path;

        $scope.address || Weixin.getJsconfig().then(function (res) {
            if ($scope.address) return;

            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });

            // 1.通过微信jssdk获取坐标,然后通过百度地图获取与坐标相关的详细信息.
            Weixin.ready(function () {
                if ($scope.address) return;

                Weixin.getLocation(function (res_) {
                    if ($scope.address) return;

                    Debug.alert(res_);
                    Weixin.getLocationName(res_.latitude, res_.longitude).then(function (res) {
                        if ($scope.address) return;

                        var result = res.data.result;

                        $localStorage.address = angular.pick(result.addressComponent, 'province', 'city', 'district', 'street');
                        $localStorage.address.geoLatitude = res_.latitude;
                        $localStorage.address.geoLongitude = res_.longitude;

                        $scope.chooseAddress($localStorage.address);

                    }).catch(function (res) {
                        Debug.alert('根据坐标获取用户位置失败');
                        Debug.alert(res);
                        $scope.css.showLocationFailed = true;
                    })
                }, function (res) {
                    Debug.alert('获取用户位置失败');
                    Debug.alert(res);
                    $scope.css.showLocationFailed = true;
                    $scope.$apply();
                })
            })
        }).catch(function (res) {
            Debug.alert('获取jsconfig失败');
            Debug.alert(res);
            $scope.css.showLocationFailed = true;
        });

        $q.all([
            Dishes.getList().then(function (res) {
                $scope.dishes = res.data;
                return true;
            }),
            User.getUserInfo().then(function (res) {
                $scope.allAddresses = res.data.address;
                $scope.cart = res.data.shoppingCart.map(function (el) {
                    var dish = el.dish;
                    dish.number = el.number;
                    if (!el.subDish) return dish;
                    dish.subDish = el.subDish.map(function (item) {
                        var sDish = item.dish;
                        sDish.number = item.number;
                        sDish.dish = sDish._id;
                        return sDish;
                    });
                    return dish;
                });
                return res.data;
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
