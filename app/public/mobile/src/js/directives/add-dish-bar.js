angular.module('xw.directives').directive('addDishBar', function (Debug, User) {
    return {
        scope: {
            dish: '=',
            user: '=',
            cart: '='
        },
        templateUrl: 'add-dish-bar.html',
        link : function ($scope) {
            var unwatcher = $scope.$watch('user', function (user) {
                if (user) {
                    unwatcher();
                    $scope.cart = user.shoppingCart.map(function (el) {
                        var dish = el.dish;
                        dish.number = el.number;
                        if (!el.subDish) return dish;
                        dish.subDish = el.subDish.map(function (item) {
                            var sDish = item.dish;
                            sDish.number = item.number;
                            sDish.dish = sDish._id;
                            return sDish;
                        });
                        return dish;
                    });
                }
            });

            $scope.$watch('dish', function (dish) {
                if (dish) {
                    var curSelection = {};
                    $scope.dish.preferences.forEach(function (property) {
                        property.foodMaterial.some(function (el) {
                            if (!el.dish.outOfStock) {
                                curSelection[property.name.zh] = el.dish;
                                return true;
                            } else return false;
                        })
                    });
                    $scope.dish.curSelection = curSelection;
                }
            });

            $scope.addToCart = function (dish) {
                var selection = dish.curSelection;
                var exist;

                // 若菜品有多属性则进行如下选择
                if (selection) {
                    dish.subDish = dish.subDish || [];

                    Object.keys(selection).forEach(function (propertyName) {
                        var item = selection[propertyName];

                        // 检查dish的subDish中是否存在curSelection
                        //  如果有, 则增加相应数量,
                        //  如果没有, 则添加curSelection到subDish
                        exist = dish.subDish.some(function (el) {
                            // el.dish为id
                            if (el.dish == item._id) {
                                el.number += dish.count;
                                return true;
                            }
                        });

                        if (!exist) {
                            dish.subDish.push({
                                dish: item._id,
                                number: dish.count,
                                title: item.title,
                                priceOriginal: item.priceOriginal
                            })
                        }
                    })
                }

                // 检查cart中是否存在dish
                //  如果有, 则增加相应数量,
                //  如果没有, 则添加到cart中
                exist = $scope.cart.some(function (el) {
                    if (el._id == dish._id) {
                        el.number += dish.count;

                        if (dish.subDish) {
                            dish.subDish.forEach(function (ds) {
                                var _exist = el.subDish.some(function (es) {
                                    if (es.dish == ds.dish) {
                                        es.number++;
                                        return true;
                                    }
                                });
                                if (!_exist) {
                                    el.subDish.push(ds);
                                }
                            })
                        }

                        return true;
                    }
                });

                if (!exist) {
                    dish.number = dish.count;
                    $scope.cart.push(dish);
                }

                dish.count = 0;

                $scope.hide();

                User.postCart($scope.cart.map(function (dish) {
                    return {
                        dish: dish._id,
                        number: dish.number,
                        subDish: dish.subDish || []
                    }
                }))
            };

            $scope.totalPrice = function () {
                var p = $scope.cart.reduce(function price(total, cur) {
                    total += cur.priceOriginal * cur.number;
                    if (cur.subDish) {
                        total += cur.subDish.reduce(price, 0)
                    }
                    return total;
                }, 0);
                if (!$scope.dish) return p;
                return p + $scope.dish.count *
                    ($scope.dish.priceOriginal +
                        (!$scope.dish.curSelection ? 0 :
                            Object.keys($scope.dish.curSelection).reduce(function (_p, name) {
                                return _p + $scope.dish.curSelection[name].priceOriginal
                            }, 0))
                    )
            };

            $scope.hide = function () {
                $scope.dish = null;
            };

        }
    }
})