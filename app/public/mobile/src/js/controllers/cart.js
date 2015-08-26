angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, ScopeDecorator) {
    ScopeDecorator.common($scope);


    $scope.increase = function (item) {
        // 先更新展示数据上的数量
        item.dish.number++;
        if (item.subDish) {
            item.subDish.number++;
        }

        // 再更新post数据上的数量
        postCart.some(function (el) {
            if (el.dish == item.dish._id) {
                el.number++;

                if (item.subDish) {
                    el.subDish.some(function (e) {
                        if (e.dish == item.subDish._id) {
                            e.number++;
                            return true;
                        }
                    })
                }
            }
        });

        User.postCart(postCart);
    };

    $scope.decrease = function (item, idx) {
        var cancel = false;
        if (item.subDish && item.subDish.number == 1) {
            cancel = !confirm('确定删除该商品吗?');
        } else if (item.dish.number == 1) {
            cancel = !confirm('确定删除该商品吗?');
        }
        if (cancel) return;

        // 先更新post数据上的数量
        postCart.some(function (el, i) {
            if (el.dish == item.dish._id) {
                el.number--;

                if (el.number == 0) {
                    postCart.splice(i, 1);
                    return true;
                }

                if (item.subDish) {
                    el.subDish.some(function (e, j) {
                        if (e.dish == item.subDish._id) {
                            e.number--;
                            if (e.number == 0) {
                                el.subDish.splice(j, 1);
                            }
                            return true;
                        }
                    })
                }
            }
        });

        // 再更新展示数据上的数量
        item.dish.number--;
        if (item.subDish) {
            item.subDish.number--;

            if (item.subDish.number == 0) {
                if (item.dish.cookingType == 'ready to cook') {
                    $scope.dishList.cookList.splice(idx, 1);
                } else {
                    $scope.dishList.eatList.splice(idx, 1);
                }
            }
        }

        User.postCart(postCart);
    };

    $scope.selectAll = function () {
        $scope.dishList.selectedAll = !$scope.dishList.selectedAll;
        $scope.dishList.cookList.forEach(function (item) {
            item.selected = !item.selected;
        });
        $scope.dishList.eatList.forEach(function (item) {
            item.selected = !item.selected;
        });
    };

    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    var postCart = null;

    function init() {
        User.getUserInfo().then(function (res) {
            var cart = res.data.shoppingCart;
            $scope.dishList = {
                cookList: [],
                eatList: []
            };
            
            cart.forEach(function (el) {
                var dish = el.dish;
                dish.number = el.number;

                var entries = [];

                if (el.subDish && el.subDish.length) {
                    el.subDish.forEach(function (item) {
                        item.dish.number = item.number;
                        item.dish.outOfStock = outOfStock(dish) || outOfStock(item.dish);

                        entries.push({
                            dish: dish,
                            subDish:item.dish
                        });
                    })
                } else {
                    entries.push({dish: dish})
                }

                if (dish.cookingType == 'ready to cook') {
                    $scope.dishList.cookList.push.apply($scope.dishList.cookList, entries);
                } else {
                    $scope.dishList.eatList.push.apply($scope.dishList.eatList, entries);
                }
            });

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