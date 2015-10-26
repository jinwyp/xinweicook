angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, $localStorage, $timeout, $filter, Dishes) {

    // clear all `cart` in $localStorage
    for (var key in $localStorage) {
        if (/cart/i.test(key)) {
            delete $localStorage.key;
        }
    }

    $scope.increase = function (item) {
        // 先更新展示数据上的数量
        item.dish.number++;
        if (item.subDish) {
            item.subDish.number++;
        }

        // 再更新post数据上的数量
        postCart.some(function (el) {
            if (el.dish._id == item.dish._id) {
                el.number++;
                
                if (item.subDish) {
                    el.subDish.some(function (e) {
                        if (e.dish._id == item.subDish._id) {
                            e.number++;
                            return true;
                        }
                    })
                }
            }
        });

        User.postCart(postCart.map(postDishFilter)).catch(function () {
            $localStorage.localBag = postCart;
        })
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
            if (el.dish._id == item.dish._id) {
                el.number--;

                if (el.number == 0) {
                    postCart.splice(i, 1);
                    return true;
                }

                if (item.subDish) {
                    el.subDish.some(function (e, j) {
                        if (e.dish._id == item.subDish._id) {
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

        User.postCart(postCart.map(postDishFilter)).catch(function () {
            $localStorage.localBag = postCart;
        })
    };

    $scope.select = function (item) {
        if (item.outOfStock) return;
        item.selected = !item.selected;

        var type = item.dish.cookingType == 'ready to cook'
            ? 'cookList' : 'eatList';

        var isAllSelected = $scope.dishList[type].every(function (item) {
            return item.selected
        });

        if (isAllSelected) {
            $scope.selectAll(type, isAllSelected);
        } else if (!isAllSelected) {
            $scope.dishList[type].selectedAll = false;
        }
    };

    $scope.selectAll = function (type, outState) {
        var state = $scope.dishList[type].selectedAll =
            (outState !== undefined ? outState : !$scope.dishList[type].selectedAll);
        $scope.dishList[type].forEach(function (item) {
            item.selected = state && !item.outOfStock;
        });
    };

    $scope.selectedDishLength = 0;
    $scope.totalPrice = function (listName) {
        var price = 0;
        var keys = listName ? [listName] : ['cookList', 'eatList'];
        $scope.dishList && keys.forEach(function (key) {
            var list = $scope.dishList[key];
            list.selectedLength = 0;
            list && list.forEach(function (el) {
                if (!el.selected) return;
                list.selectedLength++;
                if (el.subDish) {
                    price += el.subDish.number * (el.dish.priceOriginal + el.subDish.priceOriginal)
                } else {
                    price += el.dish.number * el.dish.priceOriginal;
                }
            })
        });
        return price;
    };

    $scope.next = function () {
        if (!$scope.dishList.cookList.selectedLength
            && !$scope.dishList.eatList.selectedLength
        ) {
            alert('请至少选择一份菜品');
            return;
        }

        if (!$scope.dishList.cookList.selectedLength) {
            if ($scope.dishList.eatList.filter(function (dish) {
                    return dish.selected;
                }).every(function (dish) {
                    return dish.dish.sideDishType == 'drink'
                })) {
                alert('然而只点饮料并不能配送, 亲!');
                return ;
            }
        }

        $localStorage.confirmedBag = {
            cookList: $scope.dishList.cookList.filter(function (d) {return d.selected}),
            eatList: $scope.dishList.eatList.filter(function (d) {return d.selected})
        };

        $timeout(function () {
            location.href = '/mobile/orderaddress';
        }, 150);
    };

    var adapt = $filter('adapt');
    $scope.imgAdapt = function (src) {
        return adapt(src);
    };

    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    var postDishFilter = $filter('postDish');
    var postCart = null;

    function init() {
        // 如果已登录,则用服务端购物车数据,否则使用本地数据
        User.getUserInfo().then(function (res) {
            return postCart = res.data.shoppingCart;
        }).catch(function () {
            postCart = $localStorage.localBag;
            return Dishes.getList().then(function (res) {
                var dishes = res.data;
                for (var i = 0; i < postCart.length; i++) {
                    var postItem = postCart[i];
                    updateSubDishStock(dishes, postItem);
                    if (postItem.subDish) {
                        postItem.subDish.forEach(function (el) {
                            updateSubDishStock(dishes, el)
                        })
                    }
                }
                return postCart;
            });
        }).then(function (cart) {
            initDishList(cart);
        })
    }

    function updateSubDishStock(dishes, dish) {
        return dishes.some(function (el) {
            if (el._id == dish._id) {
                dish.outOfStock = el.outOfStock;
                dish.isPublished = el.isPublished;
            }
        })
    }

    function initDishList(cart) {
        var push = [].push;
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
                        outOfStock: dish.outOfStock || item.dish.outOfStock
                    });
                })
            } else {
                entries.push({dish: dish, outOfStock: dish.outOfStock})
            }

            if (dish.cookingType == 'ready to cook') {
                push.apply($scope.dishList.cookList, entries);
            } else {
                push.apply($scope.dishList.eatList, entries);
            }
        });
    }

    init();
});