angular.module('xw.eat').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage) {
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
                el.count++;
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


    function init() {
        if ($localStorage.cart) {
            $scope.cart = $localStorage.cart;
        } else {
            $localStorage.cart = $scope.cart = [];
        }

        Dishes.getList().then(function (res) {
            $scope.dishes = res.data;

            var cart = $localStorage.cart;
            if (!cart) return;

            for (var i = 0, el; i < cart.length;) {
                el = cart[i];
                var exist = $scope.dishes.some(function (dish) {
                    if (el._id == dish._id) {
                        dish.count = el.count;
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
