angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Weixin, Debug, User, Map, $timeout, ScopeDecorator, $location, $q) {
    $scope.cart = null;
    $scope.address = '';
    $scope.curDish = null;
    $scope.css = {
        showAllAddress: false,
        showLocationFailed: false
    };

    $scope.hide = function () {
        $scope.curDish = null;
    };

    $scope.addDish = function (dish) {
        $scope.curDish = dish;
        if (!dish.count) {
            dish.count = 1;
        }
    };
    
    $scope.addToCart = function (dish) {
        var selection = dish.curSelection;
        var exist;

        if (selection) {
            dish.subDish = dish.subDish || [];

            // 检查dish的subDish中是否存在curSelection
            //  如果有, 则增加相应数量,
            //  如果没有, 则添加curSelection到subDish
            exist = dish.subDish.some(function (el) {
                // el.dish为id
                if (el.dish == selection._id) {
                    el.number += dish.count;
                    return true;
                }
            });

            if (!exist) {
                dish.subDish.push({
                    dish: selection._id,
                    number: dish.count,
                    title: selection.title,
                    priceOriginal: selection.priceOriginal
                })
            }
        }

        // 检查cart中是否存在dish
        //  如果有, 则增加相应数量,
        //  如果没有, 则添加到cart中
        exist = $scope.cart.some(function (el) {
            if (el._id == dish._id) {
                el.number += el.count;
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
        if (!$scope.curDish) return p;
        return p + $scope.curDish.count *
            ($scope.curDish.priceOriginal +
            ($scope.curDish.curSelection ? $scope.curDish.curSelection.priceOriginal : 0))
    };

    $scope.makeOrder = function () {
        var itemCount = $scope.cart.reduce(function (count, el) {
            return count + el.number;
        }, 0);
        if (itemCount < 2) {
            alert('亲, 我们的即食包是2份起送哦, 请再添加一份吧!');
            return;
        }
        if (typeof $scope.isInRange !== 'undefined') {
            if (!$scope.isInRange) {
                alert('抱歉, 当前地址不在我们配送范围之内.');
                return;
            }
        } else {
            alert('正在计算配送距离,请稍后重试');
            return
        }
        $timeout(function () {
            location.href = 'order';// todo: replace with route
        }, 200); // let $localStorage sync. but
    };

    $scope.chooseAddress = function (addr) {
        $scope.address = addr;
        $localStorage.address = addr;

        delete $scope.isInRange;
        delete $localStorage.isInRange4KM;

        Map.distance(addr.geoLatitude, addr.geoLongitude).then(function (data) {
            $scope.isInRange = $localStorage.isInRange4KM = !!data.isInRange;
            $localStorage.distance = data.distance;
        });
    };

    $scope.isRangeValid = function () {
        if (typeof $scope.isInRange !== 'undefined') {
            return $scope.isInRange;
        } else {
            alert('正在计算距离,请稍后');
            return false
        }
    };

    $scope.likeDish = function (dish) {
        Dishes.like(dish._id).then(function (res) {
            // 如果成功,并不是很有必要重新拉取用户列表.因为这里不会更新用户信息.
            dish.liked = !dish.liked;
        }).catch(Debug.promiseErrFn('更新用户喜欢状态失败'))
    };

    ScopeDecorator.nav($scope);




    function init() {
        // todo: 暂时不使用localStorage.cart去初始化dish,否则会出现严重问题, 除非加上购物车.
        //if ($localStorage.cart) {
        //    $scope.cart = $localStorage.cart;
        //} else {
        //    $localStorage.cart = $scope.cart = [];
        //}

        $localStorage.cart = $scope.cart = [];

        // 初始化选择的地址
        if ($localStorage.selectedAddress) {
            $scope.chooseAddress($localStorage.selectedAddress);
            delete $localStorage.selectedAddress;
        }

        // 初始化nav
        var path = $location.path() || '/eat';
        $location.path(path);
        $scope.path = path;

        $scope.address || Weixin.getJsconfig().then(function (res) {
            if ($scope.address) return;

            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });

            // 1.通过微信jssdk获取坐标,然后通过百度地图获取与坐标相关的详细信息.
            Weixin.ready(function () {
                if ($scope.address) return;

                Weixin.getLocation(function (res) {
                    if ($scope.address) return;

                    Debug.alert(res);
                    Weixin.getLocationName(res.latitude, res.longitude).then(function (res) {
                        if ($scope.address) return;

                        var result = res.data.result;

                        $localStorage.address = angular.pick(result.addressComponent, 'province', 'city', 'district', 'street');
                        $localStorage.address.geoLatitude = result.location.lat;
                        $localStorage.address.geoLongitude = result.location.lng;

                        $scope.chooseAddress($localStorage.address);

                    }).catch(function (res) {
                        Debug.alert('根据坐标获取用户位置失败');
                        Debug.alert(res);
                        $scope.css.showLocationFailed = true;
                    })
                }, function (res) {
                    Debug.alert('获取用户位置失败');
                    Debug.alert(res);
                    $scope.css.showLocationFailed = true;
                    $scope.$apply();
                })
            })
        }).catch(function (res) {
            Debug.alert('获取jsconfig失败');
            Debug.alert(res);
            $scope.css.showLocationFailed = true;
        });

        $q.all([
            Dishes.getList().then(function (res) {
                $scope.dishes = res.data;
                return true;
            }),
            User.getUserInfo().then(function (res) {
                $scope.allAddresses = res.data.address;
                return res.data;
            })
        ]).then(function (results) {
            //初始化用户的喜好到菜品
            var dishLikeList = results[1].dishLikeList;
            $scope.dishes.forEach(function (dish) {
                dishLikeList.some(function (el) {
                    if (el._id == dish._id) {
                        return dish.liked = true;
                    }
                })
            })
        });
    }

    init();
}


var a = {
    "_id": "5582903e4eb98f251a0478d4",
    "modifiedAt": "2015-06-29T14:37:20.313Z",
    "createdAt": "2015-06-18T09:32:46.692Z",
    "id": 1,
    "mobile": "18600000000",
    "__v": 27,
    "shoppingCart": [
        {
            "dish": {
                "_id": "558a602a3eba152266ff2b8c",
                "modifiedAt": "2015-06-29T06:10:56.198Z",
                "createdAt": "2015-06-29T06:10:56.198Z",
                "sortId": 100,
                "cookingType": "ready to cook",
                "sideDishType": "main",
                "setType": "single",
                "difficulty": 2,
                "time": 15,
                "servings": 1,
                "priceOriginal": 48,
                "__v": 0,
                "statisticViews": 0,
                "statisticLike": 0,
                "statisticSales": 0,
                "statisticHot": 0,
                "recommendSet": [],
                "topping": [
                    "5583b7faa2845dec35276b97",
                    "5583b7faa2845dec35276b98"
                ],
                "preferences": [
                    {
                        "_id": "5590e17018048fd1b05425f8",
                        "foodMaterial": [
                            {
                                "dish": "5583b7faa2845dec35276b92",
                                "_id": "5590e17018048fd1b05425fa",
                                "default": true
                            },
                            {
                                "dish": "5583b7faa2845dec35276b93",
                                "_id": "5590e17018048fd1b05425f9",
                                "default": false
                            }
                        ],
                        "name": {
                            "zh": "牛肉",
                            "en": "beef"
                        }
                    },
                    {
                        "_id": "5590e17018048fd1b05425f4",
                        "foodMaterial": [
                            {
                                "dish": "5583b7faa2845dec35276b94",
                                "_id": "5590e17018048fd1b05425f7",
                                "default": true
                            },
                            {
                                "dish": "5583b7faa2845dec35276b95",
                                "_id": "5590e17018048fd1b05425f6",
                                "default": false
                            },
                            {
                                "dish": "5583b7faa2845dec35276b96",
                                "_id": "5590e17018048fd1b05425f5",
                                "default": false
                            }
                        ],
                        "name": {
                            "zh": "菌菇",
                            "en": "mushroom"
                        }
                    }
                ],
                "priceWholesale": [
                    {
                        "quantity": 4,
                        "price": 42,
                        "_id": "5590e17018048fd1b05425fb"
                    }
                ],
                "cook": {
                    "user": "5583c96c7313f6c849c3aeb1",
                    "tips": {
                        "zh": "一般般",
                        "en": "not bad"
                    }
                },
                "tagFilter": [
                    "5590d256103f46d9ac31e3ee",
                    "5590d256103f46d9ac31e3f2"
                ],
                "region": [],
                "infoCookingStep": [
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425fd",
                        "value": {
                            "zh": "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。",
                            "en": "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."
                        },
                        "title": {
                            "zh": "准备工作",
                            "en": "Preparation work"
                        }
                    },
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425fc",
                        "value": {
                            "zh": "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。",
                            "en": "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."
                        },
                        "title": {
                            "zh": "干煸茶树菇",
                            "en": "Dry-fry the poplar mushroom"
                        }
                    }
                ],
                "infoIngredient": [
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425ff",
                        "value": {
                            "zh": "1/2个",
                            "en": "1/2"
                        },
                        "title": {
                            "zh": "彩椒",
                            "en": "Bell Pepper"
                        }
                    },
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425fe",
                        "value": {
                            "zh": "1/4个",
                            "en": "1/4"
                        },
                        "title": {
                            "zh": "洋葱",
                            "en": "Onion"
                        }
                    }
                ],
                "infoUniqueFeature": [
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b0542601",
                        "value": {
                            "zh": "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。",
                            "en": "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
                        },
                        "title": {
                            "zh": "你知道吗？",
                            "en": "Did you know?"
                        }
                    },
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b0542600",
                        "value": {
                            "zh": "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。",
                            "en": "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
                        },
                        "title": {
                            "zh": "特点",
                            "en": "Unique Feature"
                        }
                    }
                ],
                "kitchenware": [
                    {
                        "zh": "pan",
                        "en": "pan",
                        "_id": "5590e17018048fd1b0542602"
                    }
                ],
                "cover": [],
                "brief": {
                    "zh": "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。",
                    "en": "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."
                },
                "title": {
                    "zh": "干煸茶树菇孜然雪花牛柳",
                    "en": "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"
                },
                "isPublished": true,
                "publishedAt": "2015-06-29T06:10:56.178Z"
            },
            "number": 1,
            "_id": "559155c8f0ceb661087fe585",
            "subDish": [
                {
                    "dish": {
                        "_id": "5583b7faa2845dec35276b92",
                        "modifiedAt": "2015-06-29T06:10:56.159Z",
                        "createdAt": "2015-06-29T06:10:56.159Z",
                        "sortId": 100,
                        "cookingType": "ready to cook",
                        "sideDishType": "preferences",
                        "priceOriginal": 20,
                        "__v": 0,
                        "statisticViews": 0,
                        "statisticLike": 0,
                        "statisticSales": 0,
                        "statisticHot": 0,
                        "recommendSet": [],
                        "topping": [],
                        "preferences": [],
                        "priceWholesale": [],
                        "tagFilter": [],
                        "region": [],
                        "infoCookingStep": [],
                        "infoIngredient": [],
                        "infoUniqueFeature": [],
                        "kitchenware": [],
                        "cover": [],
                        "title": {
                            "zh": "澳牛",
                            "en": "aoniu"
                        },
                        "isPublished": true,
                        "publishedAt": "2015-06-29T06:10:56.142Z"
                    },
                    "number": 1,
                    "_id": "559155c8f0ceb661087fe588"
                },
                {
                    "dish": {
                        "_id": "5583b7faa2845dec35276b95",
                        "modifiedAt": "2015-06-29T06:10:56.160Z",
                        "createdAt": "2015-06-29T06:10:56.160Z",
                        "sortId": 202,
                        "cookingType": "ready to cook",
                        "sideDishType": "preferences",
                        "priceOriginal": 15,
                        "__v": 0,
                        "statisticViews": 0,
                        "statisticLike": 0,
                        "statisticSales": 0,
                        "statisticHot": 0,
                        "recommendSet": [],
                        "topping": [],
                        "preferences": [],
                        "priceWholesale": [],
                        "tagFilter": [],
                        "region": [],
                        "infoCookingStep": [],
                        "infoIngredient": [],
                        "infoUniqueFeature": [],
                        "kitchenware": [],
                        "cover": [],
                        "title": {
                            "zh": "香菇",
                            "en": "xiaogu"
                        },
                        "isPublished": true,
                        "publishedAt": "2015-06-29T06:10:56.149Z"
                    },
                    "number": 1,
                    "_id": "559155c8f0ceb661087fe587"
                },
                {
                    "dish": {
                        "_id": "5583b7faa2845dec35276b97",
                        "modifiedAt": "2015-06-29T06:10:56.161Z",
                        "createdAt": "2015-06-29T06:10:56.161Z",
                        "sortId": 501,
                        "cookingType": "ready to cook",
                        "sideDishType": "topping",
                        "priceOriginal": 20,
                        "__v": 0,
                        "statisticViews": 0,
                        "statisticLike": 0,
                        "statisticSales": 0,
                        "statisticHot": 0,
                        "recommendSet": [],
                        "topping": [],
                        "preferences": [],
                        "priceWholesale": [],
                        "tagFilter": [],
                        "region": [],
                        "infoCookingStep": [],
                        "infoIngredient": [],
                        "infoUniqueFeature": [],
                        "kitchenware": [],
                        "cover": [],
                        "title": {
                            "zh": "澳牛",
                            "en": "aoniu"
                        },
                        "isPublished": true,
                        "publishedAt": "2015-06-29T06:10:56.154Z"
                    },
                    "number": 2,
                    "_id": "559155c8f0ceb661087fe586"
                }
            ]
        },
        {
            "dish": {
                "_id": "558a602a3eba152266ff2b8c",
                "modifiedAt": "2015-06-29T06:10:56.198Z",
                "createdAt": "2015-06-29T06:10:56.198Z",
                "sortId": 100,
                "cookingType": "ready to cook",
                "sideDishType": "main",
                "setType": "single",
                "difficulty": 2,
                "time": 15,
                "servings": 1,
                "priceOriginal": 48,
                "__v": 0,
                "statisticViews": 0,
                "statisticLike": 0,
                "statisticSales": 0,
                "statisticHot": 0,
                "recommendSet": [],
                "topping": [
                    "5583b7faa2845dec35276b97",
                    "5583b7faa2845dec35276b98"
                ],
                "preferences": [
                    {
                        "_id": "5590e17018048fd1b05425f8",
                        "foodMaterial": [
                            {
                                "dish": "5583b7faa2845dec35276b92",
                                "_id": "5590e17018048fd1b05425fa",
                                "default": true
                            },
                            {
                                "dish": "5583b7faa2845dec35276b93",
                                "_id": "5590e17018048fd1b05425f9",
                                "default": false
                            }
                        ],
                        "name": {
                            "zh": "牛肉",
                            "en": "beef"
                        }
                    },
                    {
                        "_id": "5590e17018048fd1b05425f4",
                        "foodMaterial": [
                            {
                                "dish": "5583b7faa2845dec35276b94",
                                "_id": "5590e17018048fd1b05425f7",
                                "default": true
                            },
                            {
                                "dish": "5583b7faa2845dec35276b95",
                                "_id": "5590e17018048fd1b05425f6",
                                "default": false
                            },
                            {
                                "dish": "5583b7faa2845dec35276b96",
                                "_id": "5590e17018048fd1b05425f5",
                                "default": false
                            }
                        ],
                        "name": {
                            "zh": "菌菇",
                            "en": "mushroom"
                        }
                    }
                ],
                "priceWholesale": [
                    {
                        "quantity": 4,
                        "price": 42,
                        "_id": "5590e17018048fd1b05425fb"
                    }
                ],
                "cook": {
                    "user": "5583c96c7313f6c849c3aeb1",
                    "tips": {
                        "zh": "一般般",
                        "en": "not bad"
                    }
                },
                "tagFilter": [
                    "5590d256103f46d9ac31e3ee",
                    "5590d256103f46d9ac31e3f2"
                ],
                "region": [],
                "infoCookingStep": [
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425fd",
                        "value": {
                            "zh": "彩椒、洋葱切丝， 香菜切段，香料包中的大蒜切片，干辣椒切小段。",
                            "en": "Shred the bell pepper and onion, cut coriander and chilies into chunks, slice the garlic."
                        },
                        "title": {
                            "zh": "准备工作",
                            "en": "Preparation work"
                        }
                    },
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425fc",
                        "value": {
                            "zh": "大火烧热锅，倒入2/3的色拉油，加热至冒青烟。放入茶树菇，干煸至表面起皱，呈金黄色。将茶树菇捞出控油，锅中的油留取待用。",
                            "en": "Heat the pan over high heat; pour in 2/3 of the cooking oil, heat up till smoke slightly comes out. Put in poplar mushroom, dry-fry till surface wrinkling and golden. Take out and drain, reserve remaining oil in the pan."
                        },
                        "title": {
                            "zh": "干煸茶树菇",
                            "en": "Dry-fry the poplar mushroom"
                        }
                    }
                ],
                "infoIngredient": [
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425ff",
                        "value": {
                            "zh": "1/2个",
                            "en": "1/2"
                        },
                        "title": {
                            "zh": "彩椒",
                            "en": "Bell Pepper"
                        }
                    },
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b05425fe",
                        "value": {
                            "zh": "1/4个",
                            "en": "1/4"
                        },
                        "title": {
                            "zh": "洋葱",
                            "en": "Onion"
                        }
                    }
                ],
                "infoUniqueFeature": [
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b0542601",
                        "value": {
                            "zh": "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。",
                            "en": "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
                        },
                        "title": {
                            "zh": "你知道吗？",
                            "en": "Did you know?"
                        }
                    },
                    {
                        "contentType": "txt",
                        "_id": "5590e17018048fd1b0542600",
                        "value": {
                            "zh": "澳洲雪花和牛 我们严格选用澳洲进口M7草饲牛肉，挑选和牛脖颈后方上脑部位最里层、肉质最嫩的部分，油花分布均匀，鲜嫩多汁、脂香四溢，富含不饱和脂肪酸，胆固醇含量相对较低，味道与谷饲牛肉相比更为香甜，让每一位品尝者都能获得顶级享受。",
                            "en": "Australian Wagyu Beef We source the best quality Wagyu Beef from Australia’s accredited meat supplier and expert Top Cut Foods operating under the highest industry certifications to ensure the safety, taste and health of the product."
                        },
                        "title": {
                            "zh": "特点",
                            "en": "Unique Feature"
                        }
                    }
                ],
                "kitchenware": [
                    {
                        "zh": "pan",
                        "en": "pan",
                        "_id": "5590e17018048fd1b0542602"
                    }
                ],
                "cover": [],
                "brief": {
                    "zh": "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。",
                    "en": "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."
                },
                "title": {
                    "zh": "干煸茶树菇孜然雪花牛柳",
                    "en": "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"
                },
                "isPublished": true,
                "publishedAt": "2015-06-29T06:10:56.178Z"
            },
            "number": 1,
            "_id": "559155c8f0ceb661087fe581",
            "subDish": [
                {
                    "dish": {
                        "_id": "5583b7faa2845dec35276b92",
                        "modifiedAt": "2015-06-29T06:10:56.159Z",
                        "createdAt": "2015-06-29T06:10:56.159Z",
                        "sortId": 100,
                        "cookingType": "ready to cook",
                        "sideDishType": "preferences",
                        "priceOriginal": 20,
                        "__v": 0,
                        "statisticViews": 0,
                        "statisticLike": 0,
                        "statisticSales": 0,
                        "statisticHot": 0,
                        "recommendSet": [],
                        "topping": [],
                        "preferences": [],
                        "priceWholesale": [],
                        "tagFilter": [],
                        "region": [],
                        "infoCookingStep": [],
                        "infoIngredient": [],
                        "infoUniqueFeature": [],
                        "kitchenware": [],
                        "cover": [],
                        "title": {
                            "zh": "澳牛",
                            "en": "aoniu"
                        },
                        "isPublished": true,
                        "publishedAt": "2015-06-29T06:10:56.142Z"
                    },
                    "number": 1,
                    "_id": "559155c8f0ceb661087fe584"
                },
                {
                    "dish": {
                        "_id": "5583b7faa2845dec35276b95",
                        "modifiedAt": "2015-06-29T06:10:56.160Z",
                        "createdAt": "2015-06-29T06:10:56.160Z",
                        "sortId": 202,
                        "cookingType": "ready to cook",
                        "sideDishType": "preferences",
                        "priceOriginal": 15,
                        "__v": 0,
                        "statisticViews": 0,
                        "statisticLike": 0,
                        "statisticSales": 0,
                        "statisticHot": 0,
                        "recommendSet": [],
                        "topping": [],
                        "preferences": [],
                        "priceWholesale": [],
                        "tagFilter": [],
                        "region": [],
                        "infoCookingStep": [],
                        "infoIngredient": [],
                        "infoUniqueFeature": [],
                        "kitchenware": [],
                        "cover": [],
                        "title": {
                            "zh": "香菇",
                            "en": "xiaogu"
                        },
                        "isPublished": true,
                        "publishedAt": "2015-06-29T06:10:56.149Z"
                    },
                    "number": 1,
                    "_id": "559155c8f0ceb661087fe583"
                },
                {
                    "dish": {
                        "_id": "5583b7faa2845dec35276b97",
                        "modifiedAt": "2015-06-29T06:10:56.161Z",
                        "createdAt": "2015-06-29T06:10:56.161Z",
                        "sortId": 501,
                        "cookingType": "ready to cook",
                        "sideDishType": "topping",
                        "priceOriginal": 20,
                        "__v": 0,
                        "statisticViews": 0,
                        "statisticLike": 0,
                        "statisticSales": 0,
                        "statisticHot": 0,
                        "recommendSet": [],
                        "topping": [],
                        "preferences": [],
                        "priceWholesale": [],
                        "tagFilter": [],
                        "region": [],
                        "infoCookingStep": [],
                        "infoIngredient": [],
                        "infoUniqueFeature": [],
                        "kitchenware": [],
                        "cover": [],
                        "title": {
                            "zh": "澳牛",
                            "en": "aoniu"
                        },
                        "isPublished": true,
                        "publishedAt": "2015-06-29T06:10:56.154Z"
                    },
                    "number": 2,
                    "_id": "559155c8f0ceb661087fe582"
                }
            ]
        }
    ],
    "isPromoOn": true,
    "isSpam": false,
    "credit": 0,
    "address": [
        {
            "geoLatitude": 20,
            "geoLongitude": 20,
            "country": "china",
            "province": "shanghai",
            "city": "shanghai",
            "district": "shanghai",
            "street": "枫林路",
            "address": "510号",
            "contactPerson": "xinwei",
            "mobile": "13564568304",
            "alias": "",
            "remark": "",
            "_id": "5591582037db4aaf0936e5f8",
            "isDefault": false,
            "isValid": false,
            "isTemporary": false
        }
    ],
    "group": "member"
}
