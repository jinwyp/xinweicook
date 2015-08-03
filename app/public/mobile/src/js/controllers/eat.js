angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Weixin, Debug) {
    $scope.cart = null;
    $scope.address = '';
    $scope.tipShowed = false;

    $scope.subtractDish = function (dish) {
        dish.count--;

        !dish.count && $scope.cart.some(function (el, i) {
            if (el._id == dish._id) {
                $scope.cart.splice(i, 1);
                return true;
            }
        })
    };

    $scope.addDish = function (dish) {
        //if (dish.stock == 0) {
        //    return;
        //}
        if (typeof dish.count == 'undefined') {
            dish.count = 0;
        }

        dish.count++;

        //if (dish.count > dish.stock) {
        //    dish.count = dish.stock;
        //    alert('没有更多库存');
        //    return;
        //}

        var exist = $scope.cart.some(function (el) {
            if (el._id == dish._id) {
                return true;
            }
        });

        if (!exist) {
            $scope.cart.push(dish);
        }
    };

    $scope.makeOrder = function () {
        // 购买限制, 2份起送
        var itemCount = $scope.cart.reduce(function (count, el) {
            return count + el.count;
        }, 0);
        if (itemCount < 2) {
            alert('亲, 我们的即食包是2份起送哦, 请再添加一份吧!');
            return;
        }
        if (!$scope.tipShowed) {
            alert('覆盖商圈:上海市静安寺、徐家汇、新天地、徐汇滨江、原法租界各商圈及周边地区');
            $scope.tipShowed = true;
        }
        location.href = 'order';// todo: replace with route
    };


    function init() {

        if ($localStorage.cart) {
            $scope.cart = $localStorage.cart;
        } else {
            $localStorage.cart = $scope.cart = [];
        }

        Weixin.getJsconfig().then(function (res) {
            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });

            // 1.通过微信jssdk获取坐标,然后通过百度地图获取与坐标相关的详细信息.
            Weixin.ready(function () {
                Weixin.getLocation(function (res) {
                    Debug.alert(res);
                    $localStorage.isInRange4KM = Weixin.isInRange(res);
                    Weixin.getLocationName(res.latitude, res.longitude).then(function (res) {
                        try {
                            var result = res.data.result;
                            $scope.address = result.formatted_address;

                            $localStorage.address = angular.pick(result.addressComponent, 'province', 'city', 'district', 'street');
                            $localStorage.address.geoLatitude = result.location.lat;
                            $localStorage.address.geoLongitude = result.location.lng;

                            // todo : remove
                            if ($scope.cart && $scope.cart.length && $scope.cart[0].count == 30) {
                                $localStorage.isInRange4KM = true;
                            }

                        } catch(e) {
                            Debug.alert(e);
                        }
                    }).catch(function (res) {
                        Debug.alert(res);
                    })
                }, function (res) {
                    Debug.alert(res);
                })
            })
        });

        Dishes.getList().then(function (res) {
            $scope.dishes = res.data;

            var cart = $localStorage.cart;
            if (!cart) return;

            for (var i = 0, el; i < cart.length;) {
                el = cart[i];
                var exist = $scope.dishes.some(function (dish) {
                    if (el._id == dish._id) {
                        //if (dish.stock < el.count) {
                        //    el.count = dish.stock;
                        //}
                        dish.count = el.count;
                        cart[i] = dish;
                        return true;
                    }
                });
                if (!exist) {
                    cart.splice(i, 1);
                } else i++;
            }
        });
    }

    init();
}
