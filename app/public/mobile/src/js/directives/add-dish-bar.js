angular.module('xw.directives').directive('addDishBar', function (Debug, User, $localStorage, $filter, Utils) {
    return {
        scope: {
            dish: '=',
            user: '=',
            localBag: '='
        },
        templateUrl: 'add-dish-bar.html',
        link : function ($scope) {
            var storage = $scope.storage = $localStorage;
            var localBag = $scope.localBag = [];

            var unwatcher = $scope.$watch('user', function (user) {
                if (user) {
                    unwatcher();

                    $scope.localBag = localBag = Utils.mergeCarts(localBag
                        , user.shoppingCart.filter(function (item) {
                            return !!item.dish
                        }));
                    $scope.totalPrice();
                }
            });

            $scope.$watch('dish', function (dish) {
                if (dish) {
                    var curSelection = {};
                    $scope.dish.preferences.forEach(function (property) {
                        property.foodMaterial.forEach(function (el) {
                            el.outOfStock = !(el.dish.stockWarehouseObj[storage.warehouse] > 0 || el.dish.cookingType == 'ready to cook')
                        })
                        property.foodMaterial.some(function (el) {
                            if (!el.outOfStock) {
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

            /**
             * @param dish 此dish同$scope.dish
             */
            $scope.addToCart = function (dish) {
                var selection = dish.curSelection;
                var newEntry = {
                    dish: dish,
                    number: dish.count,
                    subDish: Object.keys(selection).map(function (key) {
                        return {
                            dish: selection[key],
                            number: dish.count
                        };
                    })
                };

                // 存在与cart中的与dish的id相同的dish wrapper
                // - {dish: dish, number:number, subDish: []}
                var entry;

                localBag.some(function (item) {
                    if (Utils.isSameItemInCart(item, newEntry)) {
                        entry = item;
                        entry.number += newEntry.number;
                        entry.subDish.forEach(function (sDish) {
                            sDish.number = entry.number;
                        });
                        return true;
                    }
                });

                if (!entry) {
                    localBag.push(newEntry);
                }

                dish.count = 0;

                $scope.hide();

                User.postCart(localBag.filter(function(item){return !!item.dish}).map(postDishFilter));

                $scope.totalPrice();
            };

            var postDishFilter = $filter('postDish');

            $scope.totalPrice = function () {
                var p = localBag.filter(function(item){return !!item.dish}).reduce(function price(total, cur) {
                    total += cur.dish.priceOriginal * cur.number;
                    if (cur.subDish) {
                        total += cur.subDish.reduce(price, 0)
                    }
                    return total;
                }, 0);
                return localBag.price = p;
            };

            $scope.totalPrice();

            $scope.hide = function () {
                $scope.dish = null;
            };

        }
    }
})