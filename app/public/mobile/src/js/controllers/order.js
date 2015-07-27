angular.module('xw.order').controller('orderCtrl', orderCtrl);

function orderCtrl($scope, $localStorage, Orders, User) {
    $scope.cart = null;
    $scope.address = '';

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
        location.href = 'order.html';// todo: replace it with route
    };

    $scope.back = function () {
        history.back();
    };


    function init() {
        if ($localStorage.cart) {
            $scope.cart = $localStorage.cart;
        } else {
            location.href = 'eat-list.html';
        }

        // todo : set fake address, to delete it later.
        $localStorage.address = {province:'上海', city: '上海', district: '徐汇', street: '中山南二路', isCityShanghai: true, isInRange4KM: true};

        if ($localStorage.address) {
            Orders.deliveryTime($scope.address = $localStorage.address).then(function (res) {
                $scope.deliveryTime = res.data;
            }).catch(function (res) {
                console.log('get time error');
            })
        }
        
        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
        })
    }

    init();
}
