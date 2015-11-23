angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, $localStorage, $timeout, $filter, Dishes, Utils, $q) {

    $scope.increase = function (item) {
        // 先更新展示数据上的数量
        item.number++;
        item.subDish.forEach(function (sDish) {
            sDish.number = item.number;
        });

        User.postCart(postCart.map(postDishFilter))
    };

    $scope.decrease = function (item, idx) {
        var key = item.dish.cookingType == 'ready to cook' ? 'cookList' : 'eatList';
        var list = $scope.dishList[key];
        if (item.number == 1) {
            $scope.confirm().then(function (confirm) {
                if (!confirm) return;

                remove();
            })
        } else remove();

        function remove() {
            item.number--;
            item.subDish.forEach(function (el) {
                el.number--;
            });

            if (!item.number) {
                list.splice(idx, 1);
                postCart.splice(postCart.indexOf(item), 1);
            }

            User.postCart(postCart.map(postDishFilter))
        }
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

    var dishPrice = $filter('dishPrice');
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
                price += dishPrice(el, true);
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
            location.href = '/mobile/orderpay';
        }, 150);
    };

    var adapt = $filter('adapt');
    $scope.imgAdapt = function (src) {
        return adapt(src);
    };

    var postDishFilter = $filter('postDish');
    var postCart = null;

    function init() {
        // 如果已登录,则用合并服务器数据到本地
        $q.all([
            User.getUserInfo().then(function (res) { // 服务器数据
                return res.data.shoppingCart
            }).catch(function () {
                return []
            }).then(function (serverBag) {

                postCart = Utils.mergeCarts([], serverBag);
                var mainStockIds = $localStorage.mainStockIds.reduce(function (map, id) {
                    map[id] = true;
                    return map;
                }, {});
                var preferencesStockIds = $localStorage.preferenceStockIds.reduce(function (map, id) {
                    map[id] = true;
                    return map;
                }, {});

                // 更新库存信息
                for (var i = 0; i < postCart.length; i++) {
                    var pDish = postCart[i].dish;
                    pDish.outOfStock = !mainStockIds[pDish._id];

                    if (postCart[i].subDish) {
                        postCart[i].subDish.forEach(function (el) {
                            el.dish.outOfStock = !preferencesStockIds[el.dish._id];
                        })
                    }

                    // 预先算好, 避免html上多余的计算
                    postCart[i].outOfStock = !stockOfItem(postCart[i]);
                    if (postCart[i].outOfStock) {
                        postCart[i].selected = false;
                    }
                }

                return postCart;
            }),
            Dishes.getList('caohejing1', 'ready to eat')
        ]).then(function (res) {
            var cart = res[0];
            var dishList = res[1].data;
            initDishList(cart, dishList);
        })

    }

    function stockOfItem (item) {
        var hasStock = !item.dish.outOfStock;
        if (item.subDish) {
            hasStock = hasStock && item.subDish.every(function (el) {
                    return !el.dish.outOfStock;
                })
        }
        return hasStock;
    }

    function initDishList(cart, list) {
        $scope.dishList = {
            cookList: [],
            eatList: [],
            noReachList: []
        };

        var warehouse = $localStorage.warehouse;

        var dishMap = list.reduce(function (map, dish) {
            if (!map[dish._id]) {
                map[dish._id] = dish;
            }
            return map;
        }, {});

        cart.forEach(function (el) {
            var dish = el.dish;

            // postCart的dish和list上的引用的是同一个对象
            if (dish.cookingType == 'ready to cook') {
                $scope.dishList.cookList.push(el);
            } else {
                if (dishMap[dish._id] && dishMap[dish._id].stockWarehouseObj[warehouse] > 0) {
                    $scope.dishList.eatList.push(el);
                } else {
                    $scope.dishList.noReachList.push(el);
                }
            }
        });
    }

    init();
});