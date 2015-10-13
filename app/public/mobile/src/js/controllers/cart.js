angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, ScopeDecorator, $localStorage, $timeout, $filter) {
    ScopeDecorator.common($scope);

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
            $localStorage.addDishCart = postCart;
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
            $localStorage.addDishCart = postCart;
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

        //var lists = {cookList: null, eatList: null};
        //var orderLists = {cookList: null, eatList: null};
        //
        //Object.keys(lists).forEach(function (name) {
        //    var list = lists[name] = $scope.dishList[name] && $scope.dishList[name]
        //            .filter(function (el) {return !!el.selected});
        //    var cookingType = name == 'cookList' ? 'ready to cook' : 'ready to eat';
        //    var orderList = orderLists[name] = postCart.filter(function (el) {
        //        return el.dish.cookingType == cookingType;
        //    });
        //
        //    // 从orderList中删掉那些不在list中的子菜品
        //    for (var i = 0; i < orderList.length;) {
        //        var dish = orderList[i];
        //        if (!list.some(function (el) {return el.dish._id == dish.dish;})) {
        //            orderList.splice(i, 1);
        //        } else if (dish.subDish) {
        //            for (var j = 0; j < dish.subDish.length;) {
        //                var sDish = dish.subDish[j];
        //                if (!list.some(function (el) {
        //                        if (!el.subDish) return false;
        //                        return el.subDish._id == sDish.dish;
        //                    })) {
        //                    dish.subDish.splice(j, 1);
        //                } else j++;
        //            }
        //            i++;
        //        } else i++;
        //    }
        //});
        //
        //$localStorage.cart = orderLists;

        $localStorage.confirmedCart = {
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
            postCart = res.data.shoppingCart;
            initDishList(postCart);
        }).catch(function () {
            postCart = $localStorage.addDishCart;
            initDishList(postCart);
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