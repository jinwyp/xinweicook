angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, ScopeDecorator) {
    ScopeDecorator.common($scope);

    var postCart = {};

    function init() {
        User.getUserInfo().then(function (res) {
            $scope.cart = res.data.shoppingCart;

            postCart.shoppingCart = $scope.cart.map(function (dish) {
                var newDish = {
                    dish: dish._id,
                    number: dish.number
                };
                if (dish.subDish && dish.subDish.length) {
                    newDish.subDish = dish.subDish.map(function (el) {
                        return {
                            dish: el._id,
                            number: el.number
                        }
                    })

                }

                return newDish;
            })
        })
    }

    init();
});