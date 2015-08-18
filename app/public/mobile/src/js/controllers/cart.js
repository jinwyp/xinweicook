angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, ScopeDecorator) {
    ScopeDecorator.common($scope);


    $scope.increase = function (dish) {
        dish.number++;
    }



    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    var postCart = null;

    function init() {
        User.getUserInfo().then(function (res) {
            var cart = res.data.shoppingCart;
            $scope.cookList = [];
            $scope.eatList = [];

            cart.forEach(function (el) {
                var dish = el.dish;
                dish.number = el.number;
                dish.outOfStock = outOfStock(dish);
                if (dish.cookingType == 'ready to cook') {
                    $scope.cookList.push(dish);
                } else {
                    $scope.eatList.push(dish);
                }
            });

            // postCart的序号和
            postCart = cart.map(function (el) {
                var dish = el.dish;
                var newDish = {
                    dish: dish._id,
                    number: el.number
                };
                if (el.subDish && el.subDish.length) {
                    newDish.subDish = el.subDish.map(function (item) {
                        return {
                            dish: item.dish._id,
                            number: item.number
                        }
                    })

                }

                return newDish;
            })
        })
    }

    init();
});