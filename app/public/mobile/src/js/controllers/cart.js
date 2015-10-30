angular.module('xw.controllers').controller('cartCtrl', function ($scope, User, $localStorage, $timeout, $filter, Dishes, Utils, $q) {

    window.onerror = function (e) {
        alert(JSON.stringify(e));
    };

    // clear all `cart` in $localStorage
    try {
        if ($localStorage.localBag) {
            var localBag = $localStorage.localBag;
            var dishIdMap = {};
            for (var i = 0; i < localBag.length; i++) {
                var id = localBag[i]._id;
                var subDish = localBag[i].subDish;
                for (var j = 0; j < localBag[i].subDish; j++) {
                    id += subDish[j]._id;
                }
                if (!dishIdMap[id]) dishIdMap[id] = true;
                else {
                    localBag.splice(i--, 1)
                }
            }
        }
        for (var key in $localStorage) {
            if (/cart/i.test(key)) {
                delete $localStorage[key];
            }
        }
    } catch(e) {

    }


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
        var cancel = false;
        var key = item.dish.cookingType == 'ready to cook' ? 'cookList' : 'eatList';
        var list = $scope.dishList[key];
        if (item.number == 1) {
            cancel = !confirm('确定删除该商品吗?');
        }
        if (cancel) return;

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
    };

    $scope.select = function (item) {
        if (item.dish.outOfStock) return;
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
            item.selected = state && !item.dish.outOfStock;
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

    function outOfStock (dish) {
        return dish.outOfStock || !dish.isPublished;
    }

    var postDishFilter = $filter('postDish');
    var postCart = null;

    function init() {
        var warehouse = $localStorage.warehouse;

        // 如果已登录,则用合并服务器数据到本地
        $q.all([
            ((function () {
                var localBag = $localStorage.localBag;
                if (localBag) { //本地数据需要更新库存信息
                    return Dishes.getList(warehouse).then(function (res) {
                        var dishes = res.data;
                        for (var i = 0; i < localBag.length; i++) {
                            var postItem = localBag[i];
                            updateSubDishStock(dishes, postItem.dish);
                            if (postItem.subDish) {
                                postItem.subDish.forEach(function (el) {
                                    updateSubDishStock(dishes, el.dish)
                                })
                            }
                        }
                        return localBag
                    });
                } else return $q.resolve($localStorage.localBag = [])
            })()),

            User.getUserInfo().then(function (res) { // 服务器数据
                return res.data.shoppingCart
            }).catch(function () {
                return []
            })
        ]).then(function (carts) {
            postCart = Utils.mergeCarts(carts[0], carts[1]);
            initDishList(postCart);
        });
    }

    function updateSubDishStock(dishes, dish) {
        return dishes.some(function (el) {
            if (el._id == dish._id) {
                dish.outOfStock = el.outOfStock;
                dish.isPublished = el.isPublished;
                return true;
            }
        })
    }

    function initDishList(cart) {
        $scope.dishList = {
            cookList: [],
            eatList: []
        };

        cart.forEach(function (el) {
            var dish = el.dish;
            dish.outOfStock = outOfStock(dish) || el.subDish.some(function (item) {
                return outOfStock(item.dish);
            });

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