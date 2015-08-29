angular.module('xw.controllers').controller('cookCtrl', function ($scope, Dishes, Debug, User, $localStorage) {
    $scope.cart = [];
    $scope.user = null;

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

    $scope.goToCart = function () {
        var url = '';
        if (typeof $localStorage.address == 'undefined') {
            alert('请选择收货地址');
            url = '/mobile/';
        } else {
            url = '/mobile/cart';
        }
        setTimeout(function () {
            location.href = url;// todo: replace with route
        }, 100); // let $localStorage sync. but
    };

    function init() {
        var paths = location.href.split('/');
        var dishId = paths[paths.length - 1];

        Dishes.getOne(dishId).then(function (res) {
            $scope.dish = res.data;
        }).then(Debug.promiseErrFn('获取Dish失败'));

        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
        })
    }

    init();
});