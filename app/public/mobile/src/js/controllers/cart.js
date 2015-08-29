angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, ScopeDecorator, $localStorage, $timeout, $filter) {
    ScopeDecorator.common($scope);

    $scope.isInRange = false;

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
        var key = item.dish.cookingType == 'ready to cook' ? 'cookList' : 'eatList';
        var list = $scope.dishList[key];
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
        if (item.subDish) {
            item.subDish.number--;
            item.dish.number--;

            // 主菜品在其number为0时,也会被删掉
            if (item.subDish.number == 0) {
                list.splice(idx, 1);
            }
        } else if (!--item.dish.number) {
            list.splice(idx, 1);
        }

        User.postCart(postCart);
    };

    $scope.select = function (item) {
        if (item.outOfStock) return;
        if (item.dish.cookingType == 'ready to eat' && !$scope.isInRange) {
            item.selected = false;
            return;
        }
        item.selected = !item.selected;
    };

    $scope.selectAll = function () {
        var state = $scope.dishList.selectedAll = !$scope.dishList.selectedAll;
        $scope.dishList.cookList.forEach(function (item) {
            item.selected = state && !item.outOfStock;
        });
        $scope.dishList.eatList.forEach(function (item) {
            item.selected = state && !item.outOfStock && $scope.isInRange;
        });
    };

    $scope.totalPrice = function () {
        var price = 0;
        var keys = ['cookList', 'eatList'];
        $scope.dishList && keys.forEach(function (key) {
            var list = $scope.dishList[key];
            list && list.forEach(function (el) {
                if (!el.selected) return;
                if (el.subDish) {
                    price += el.subDish.number * el.dish.priceOriginal + el.subDish.priceOriginal
                } else {
                    price += el.dish.number * el.dish.priceOriginal;
                }
            })
        });
        return price;
    };

    $scope.makeOrder = function () {
        if ($scope.dishList.eatList.length) {
            var bentoSelected = false;
            var count = $scope.dishList.eatList.reduce(function (c, el) {
                if (el.selected) bentoSelected = true;
                var number = 0;
                if (el.subDish) {
                    number = el.subDish.number;
                } else {
                    number = el.dish.number;
                }
                return c + number;
            }, 0);
            if (!bentoSelected) count = 100;
            if (count < 2) {
                alert('便当2份起送, 请添加更多便当');
                return;
            }
        }

        var lists = {cookList: null, eatList: null};
        var orderLists = {cookList: null, eatList: null};

        Object.keys(lists).forEach(function (name) {
            var list = lists[name] = $scope.dishList[name] && $scope.dishList[name].filter(function (el) {return !!el.selected});
            var cookingType = name == 'cookList' ? 'ready to cook' : 'ready to eat';
            var orderList = orderLists[name] = postCart.filter(function (el) {
                return el.cookingType == cookingType;
            });

            // 从orderList中删掉那些不在list中的子菜品
            for (var i = 0; i < orderList.length;) {
                var dish = orderList[i];
                if (!list.some(function (el) {return el.dish._id == dish.dish;})) {
                    orderList.splice(i, 1);
                } else if (dish.subDish) {
                    for (var j = 0; j < dish.subDish.length;) {
                        var sDish = dish.subDish[j];
                        if (!list.some(function (el) {return el.subDish._id == sDish.dish;})) {
                            dish.subDish.splice(j, 1);
                        } else j++;
                    }
                    i++;
                } else i++;
            }
        });

        $localStorage.cart = orderLists;

        $timeout(function () {
            location.href = 'order';
        }, 150);
    };

    $scope.okToBuy = function () {
        if ($scope.dishList && $scope.dishList.cookList) {
            return $scope.dishList.cookList.some(function (el) {return el.selected})
                || $scope.dishList.eatList.some(function (el) {return el.selected})
        } else return false;
    };

    var adapt = $filter('adapt');
    $scope.imgAdapt = function (src) {
        return adapt(src);
    };

    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    var postCart = null;

    function init() {

        if (typeof $localStorage.isInRange4KM == 'undefined') location.href='/mobile/';
        $scope.isInRange = $localStorage.isInRange4KM;

        User.getUserInfo().then(function (res) {
            var cart = res.data.shoppingCart;
            $scope.dishList = {
                cookList: [],
                eatList: []
            };
            
            cart.forEach(function (el) {
                var dish = el.dish;
                dish.number = el.number;
                dish.outOfStock = outOfStock(dish);

                var entries = [];

                if (el.subDish && el.subDish.length) {
                    el.subDish.forEach(function (item) {
                        item.dish.number = item.number;
                        item.dish.outOfStock = outOfStock(dish) || outOfStock(item.dish);

                        entries.push({
                            dish: dish,
                            subDish:item.dish,
                            outOfStock: dish.outOfStock && item.dish.outOfStock
                        });
                    })
                } else {
                    entries.push({dish: dish, outOfStock: dish.outOfStock})
                }

                if (dish.cookingType == 'ready to cook') {
                    $scope.dishList.cookList.push.apply($scope.dishList.cookList, entries);
                } else {
                    $scope.dishList.eatList.push.apply($scope.dishList.eatList, entries);
                }
            });

            // postCart 与 订单提交时的结构是一致的.
            postCart = cart.map(function (el) {
                var dish = el.dish;
                var newDish = {
                    _id: dish._id,
                    dish: dish._id,
                    number: el.number,
                    cookingType: dish.cookingType,
                    title: dish.title,
                    priceOriginal: dish.priceOriginal
                };
                if (el.subDish && el.subDish.length) {
                    newDish.subDish = el.subDish.map(function (item) {
                        return {
                            _id: item.dish._id,
                            dish: item.dish._id,
                            number: item.number,
                            cookingType: item.dish.cookingType,
                            title: item.dish.title,
                            priceOriginal: item.dish.priceOriginal
                        }
                    })

                }

                return newDish;
            })
        })
    }

    init();
});