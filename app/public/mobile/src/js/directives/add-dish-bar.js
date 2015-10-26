angular.module('xw.directives').directive('addDishBar', function (Debug, User, $localStorage, $filter) {
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
                    $scope.cart = user.shoppingCart;
                    $scope.totalPrice();
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
                    // dish.curSelection存储多属性下的各选中dish,
                    // 是一个以各属性名为key, 属性下的某个有货dish为value对象
                    // (尽管一个属性下有可能多个有货dish,但当前选中但只有一个dish)
                    $scope.dish.curSelection = curSelection;
                }
            });

            if ($localStorage.localBag) {
                $scope.cart = $localStorage.localBag;
            }

            /**
             * @param dish 此dish同$scope.dish
             */
            $scope.addToCart = function (dish) {
                var selection = dish.curSelection;
                var newEntry = {
                    dish: dish,
                    number: dish.count,
                    sudDish: Object.keys(selection).map(function (key) {
                        return selection[key];
                    })
                }

                // 存在与cart中的与dish的id相同的dish wrapper - {dish: dish, number:number, subDish: []}
                var entry;

                $scope.cart.some(function (item) {
                    if (item.dish._id == dish._id) {
                        entry = item;
                        return true;
                    }
                });

                // 如果cart已经存在主dish, 则更新主dish的子菜品
                if (entry) {
                    // 先增加主dish上的count
                    entry.number += dish.count;
                    // 然后处理子菜品
                    Object.keys(selection).forEach(function (propertyName) {
                        var item = selection[propertyName];
                        var sEntry;
                        entry.subDish = entry.subDish || [];
                        entry.subDish.some(function (el) {
                            if (el.dish._id == item._id) {
                                sEntry = el;
                                return true;
                            }
                        });

                        // 如果subDish中已经存在sDish,则更新
                        if (sEntry) {
                            sEntry.number += dish.count;
                        } else {
                            entry.subDish.push({
                                dish: item,
                                number: dish.count
                            })
                        }
                    })
                } else {
                    $scope.cart.push({
                        dish: dish,
                        number: dish.count,
                        subDish: Object.keys(selection).map(function (propertyName) {
                            return {
                                dish: selection[propertyName],
                                number: dish.count
                            }
                        })
                    });
                }

                dish.count = 0;

                $scope.hide();

                User.postCart($scope.cart.map(postDishFilter)).catch(function () {
                    $localStorage.localBag = $scope.cart;
                });

                $scope.totalPrice();
            };

            var postDishFilter = $filter('postDish');

            $scope.totalPrice = function () {
                var p = $scope.cart.reduce(function price(total, cur) {
                    total += cur.dish.priceOriginal * cur.number;
                    if (cur.subDish) {
                        total += cur.subDish.reduce(price, 0)
                    }
                    return total;
                }, 0);
                return $scope.cart.price = p;
            };

            $scope.totalPrice();

            $scope.hide = function () {
                $scope.dish = null;
            };

        }
    }
})