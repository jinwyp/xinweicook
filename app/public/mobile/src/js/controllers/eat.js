angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Weixin, Debug, User, Map) {
    $scope.cart = null;
    $scope.address = '';
    $scope.tipShowed = false;
    $scope.css = {
        showAllAddress: false,
        showLocationFailed: false
    };

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
        if (typeof dish.count == 'undefined') {
            dish.count = 0;
        }

        dish.count++;

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
        var itemCount = $scope.cart.reduce(function (count, el) {
            return count + el.count;
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
        location.href = 'order';// todo: replace with route
    };

    $scope.chooseAddress = function (addr) {
        $scope.address = addr;
        $localStorage.address = addr;

        delete $scope.isInRange;
        delete $localStorage.isInRange4KM;

        Map.distance(addr.geoLatitude, addr.geoLongitude).then(function (data) {
            $scope.isInRange = $localStorage.isInRange4KM = !!data.isInRange;
            $localStorage.distance = data.distance;
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




    function init() {

        if ($localStorage.cart) {
            $scope.cart = $localStorage.cart;
        } else {
            $localStorage.cart = $scope.cart = [];
        }

        if ($localStorage.selectedAddress) {
            $scope.chooseAddress($localStorage.selectedAddress);
            delete $localStorage.selectedAddress;
        }

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

                Weixin.getLocation(function (res) {
                    if ($scope.address) return;

                    Debug.alert(res);
                    Weixin.getLocationName(res.latitude, res.longitude).then(function (res) {
                        if ($scope.address) return;

                        var result = res.data.result;

                        $localStorage.address = angular.pick(result.addressComponent, 'province', 'city', 'district', 'street');
                        $localStorage.address.geoLatitude = result.location.lat;
                        $localStorage.address.geoLongitude = result.location.lng;

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
        })

        Dishes.getList().then(function (res) {
            $scope.dishes = res.data;

            var cart = $localStorage.cart;
            if (!cart) return;

            for (var i = 0, el; i < cart.length;) {
                el = cart[i];
                var exist = $scope.dishes.some(function (dish) {
                    if (el._id == dish._id) {
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

        User.getUserInfo().then(function (res) {
            $scope.allAddresses = res.data.address;
        })
    }

    init();
}
