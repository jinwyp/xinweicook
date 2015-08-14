angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, ScopeDecorator) {
    ScopeDecorator.common($scope);

    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    var postCart = {};

    function init() {
        User.getUserInfo().then(function (res) {
            var cart = res.data.shoppingCart;
            $scope.cookList = [];
            $scope.eatList = [];

            cart.forEach(function (dish) {
                dish.outOfStock = outOfStock(dish);
                if (dish.cookingType == 'ready to cook') {
                    $scope.cookList.push(dish);
                } else {
                    $scope.eatList.push(dish);
                }
            });

            postCart.shoppingCart = cart.map(function (dish) {
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