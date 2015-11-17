angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, $localStorage, $timeout, $filter, Dishes, Utils, $q) {

    // localBag may be has some bug.
    try {
        if ($localStorage.localBag) {
            var localBag = $localStorage.localBag;
            var dishIdMap = {};
            for (var i = 0; i < localBag.length; i++) {
                var id = localBag[i].dish._id;
                var subDish = localBag[i].subDish;
                for (var j = 0; j < localBag[i].subDish.length; j++) {
                    id += subDish[j].dish._id;
                }
                if (!dishIdMap[id]) dishIdMap[id] = true;
                else {
                    localBag.splice(i--, 1)
                }
            }
        }
    } catch(e) {

    }

    $scope.fn = {};

    $scope.increase = function (item) {
        // 先更新展示数据上的数量
        item.number++;
        item.subDish.forEach(function (sDish) {
            sDish.number = item.number;
        });

        User.postCart(postCart.map(postDishFilter)).catch(function () {
            $localStorage.localBag = postCart;
        })
    };

    $scope.decrease = function (item, idx) {
        var key = item.dish.cookingType == 'ready to cook' ? 'cookList' : 'eatList';
        var list = $scope.dishList[key];
        if (item.number == 1) {
            $scope.fn.confirm().then(function (confirm) {
                if (!confirm) return;

                item.number--;
                item.subDish.forEach(function (el) {
                    el.number--;
                });

                if (!item.number) {
                    list.splice(idx, 1);
                    postCart.splice(postCart.indexOf(item), 1);
                }

                User.postCart(postCart.map(postDishFilter)).catch(function () {
                    $localStorage.localBag = postCart;
                })
            })
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
            location.href = '/mobile/orderaddress';
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
        User.getUserInfo().then(function (res) { // 服务器数据
            return res.data.shoppingCart
        }).catch(function () {
            return []
        }).then(function (serverBag) {
            var localBag = $localStorage.localBag || [];

            $localStorage.localBag = postCart = Utils.mergeCarts(localBag, serverBag);
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

            initDishList(postCart);
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

    function initDishList(cart) {
        $scope.dishList = {
            cookList: [],
            eatList: []
        };

        cart.forEach(function (el) {
            var dish = el.dish;

            // postCart的dish和list上的引用的是同一个对象
            if (dish.cookingType == 'ready to cook') {
                $scope.dishList.cookList.push(el);
            } else {
                $scope.dishList.eatList.push(el);
            }
        });
    }

    init();
});