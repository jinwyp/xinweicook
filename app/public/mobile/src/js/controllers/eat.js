angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Weixin, Debug, User, Map, $timeout, ScopeDecorator, $location, $q) {
    $scope.cart = [];
    $scope.user = null;
    $scope.address = '';
    $scope.curDish = null; // 点击购买后被选中的菜品
    $scope.css = {
        showAllAddress: false,
        showLocationFailed: false
    };

    $scope.addDish = function (dish) {
        $scope.curDish = dish;
        if (!dish.count) {
            dish.count = 1;
        }
    };

    $scope.goToCart = function () {
        if (typeof $scope.isInRange == 'undefined') {
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
