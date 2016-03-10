angular.module('xw.controllers').controller('cookCtrl', function ($scope, Address, Dishes, Debug, User, $localStorage) {
    $scope.user = null;
    $scope.address = '';
    $scope.addressLoaded = false;

    $scope.likeDish = function (dish) {
        Dishes.like(dish._id).then(function (res) {
            // 如果成功,并不是很有必要重新拉取用户列表.因为这里不会更新用户信息.
            dish.liked = !dish.liked;
        }).catch(Debug.promiseErrFn('更新用户喜欢状态失败'))
    };

    $scope.addDish = function (dish) {
        $scope.curDish = dish;
        if (!dish.count) {
            dish.count = 1;
        }
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

    function init() {
        var paths = location.href.split('/');
        var dishId = $scope.dishId = paths[paths.length - 1];

        Dishes.getOne(dishId).then(function (res) {
            $scope.dish = res.data;
        }).then(Debug.promiseErrFn('获取Dish失败'));

        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
        });

        Address.getList().then(function (res) {
            $scope.addresses = res.data;
            if (!$scope.addresses.length) return;

            // 选择了一个地址,将此作为默认地址
            if ($localStorage.selectedAddress) {
                $scope.address = $localStorage.selectedAddress;
                $scope.address.isDefault = true;
                Address.update($scope.address).then(function () {
                    delete $localStorage.selectedAddress;
                });
            } else {
                // 如果没有经过选择,则选择一个可配送默认地址
                $scope.addresses.some(function (addr) {
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
            $localStorage.warehouse = $scope.warehouse = $scope.address.warehouse;
            $localStorage.orderAddress = $scope.address;
        }).catch(angular.noop).then(function () {
            $scope.addressLoaded = true;
        });
    }

    init();
});
//# sourceMappingURL=cook.95baaaae.js.map
