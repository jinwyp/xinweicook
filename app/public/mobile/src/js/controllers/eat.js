angular.module('xw.controllers').controller('eatCtrl', eatCtrl);

function eatCtrl($scope, Dishes, $localStorage, Weixin, Debug, User, Map, $timeout) {
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




    function init() {
        // todo: 暂时不使用localStorage.cart去初始化dish,否则会出现严重问题, 除非加上购物车.
        //if ($localStorage.cart) {
        //    $scope.cart = $localStorage.cart;
        //} else {
        //    $localStorage.cart = $scope.cart = [];
        //}

        $localStorage.cart = $scope.cart = [];

        if ($localStorage.selectedAddress) {
            $scope.chooseAddress($localStorage.selectedAddress);
            delete $localStorage.selectedAddress;
        }

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
        })

        Dishes.getList().then(function (res) {
            $scope.dishes = res.data;

            var cart = $localStorage.cart;
            if (!cart || !cart.length) return;

            for (var i = 0, el; i < cart.length;) {
                el = cart[i];
                var exist = $scope.dishes.some(function (dish) {
                    if (el._id == dish._id) {
                        dish.count = el.count;
                        cart[i] = dish;
                        return true;
                    }
                });
                if (!exist) {
                    cart.splice(i, 1);
                } else i++;
            }
        });

        User.getUserInfo().then(function (res) {
            $scope.allAddresses = res.data.address;
        })
    }

    init();
}


var a = {
    "__v": 0,
    "modifiedAt": "2015-07-08T06:49:27.889Z",
    "createdAt": "2015-07-08T06:49:27.889Z",
    "id": 19,
    "orderNumber": "201507081449278223134",
    "user": "559a1d9dfd69a2071deac899",
    "cookingType": "ready to cook",
    "clientFrom": "ios",
    "payment": "alipay direct",
    "paymentUsedCash": false,
    "coupon": "5590d256103f46d9ac31e3ee",
    "promotionCode": "xxxxxxx",
    "credit": 0,
    "freight": 20,
    "dishesPrice": 246,
    "totalPrice": 266,
    "deliveryDateTime": "2015-06-13T02:00:00.000Z",
    "deliveryDate": "2015-06-13",
    "deliveryTime": "10",
    "_id": "559cc7f766835c3486630d75",
    "dishHistory": [
        {
            "_id": "5583b7faa2845dec35276b92",
            "modifiedAt": "2015-07-06T06:16:42.027Z",
            "createdAt": "2015-07-06T06:16:42.027Z",
            "sortId": 100,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikeUserList": [],
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
            "publishedAt": "2015-07-06T06:16:42.015Z"
        },
        {
            "_id": "5583b7faa2845dec35276b95",
            "modifiedAt": "2015-07-06T06:16:42.027Z",
            "createdAt": "2015-07-06T06:16:42.027Z",
            "sortId": 202,
            "cookingType": "ready to cook",
            "sideDishType": "preferences",
            "priceOriginal": 15,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikeUserList": [],
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
            "publishedAt": "2015-07-06T06:16:42.021Z"
        },
        {
            "_id": "5583b7faa2845dec35276b97",
            "modifiedAt": "2015-07-06T06:16:42.028Z",
            "createdAt": "2015-07-06T06:16:42.028Z",
            "sortId": 501,
            "cookingType": "ready to cook",
            "sideDishType": "topping",
            "priceOriginal": 20,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikeUserList": [],
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
            "publishedAt": "2015-07-06T06:16:42.023Z"
        },
        {
            "_id": "558a602a3eba152266ff2b8c",
            "modifiedAt": "2015-07-06T09:34:45.910Z",
            "createdAt": "2015-07-06T06:16:42.076Z",
            "sortId": 100,
            "cookingType": "ready to cook",
            "sideDishType": "main",
            "setType": "single",
            "difficulty": 2,
            "time": 15,
            "servings": 1,
            "priceOriginal": 48,
            "__v": 37,
            "statisticViews": 0,
            "statisticLikeUserList": [
                "559a1d9dfd69a2071deac899"
            ],
            "statisticLike": 1,
            "statisticSales": 0,
            "statisticHot": 0,
            "recommendSet": [],
            "topping": [
                "5583b7faa2845dec35276b97",
                "5583b7faa2845dec35276b98"
            ],
            "preferences": [
                {
                    "_id": "559a1d4afd69a2071deac879",
                    "foodMaterial": [
                        {
                            "dish": "5583b7faa2845dec35276b92",
                            "_id": "559a1d4afd69a2071deac87b",
                            "default": true
                        },
                        {
                            "dish": "5583b7faa2845dec35276b93",
                            "_id": "559a1d4afd69a2071deac87a",
                            "default": false
                        }
                    ],
                    "name": {
                        "zh": "牛肉",
                        "en": "beef"
                    }
                },
                {
                    "_id": "559a1d4afd69a2071deac875",
                    "foodMaterial": [
                        {
                            "dish": "5583b7faa2845dec35276b94",
                            "_id": "559a1d4afd69a2071deac878",
                            "default": true
                        },
                        {
                            "dish": "5583b7faa2845dec35276b95",
                            "_id": "559a1d4afd69a2071deac877",
                            "default": false
                        },
                        {
                            "dish": "5583b7faa2845dec35276b96",
                            "_id": "559a1d4afd69a2071deac876",
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
                    "_id": "559a1d4afd69a2071deac87c"
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
                    "_id": "559a1d4afd69a2071deac87e",
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
                    "_id": "559a1d4afd69a2071deac87d",
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
                    "_id": "559a1d4afd69a2071deac880",
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
                    "_id": "559a1d4afd69a2071deac87f",
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
                    "_id": "559a1d4afd69a2071deac882",
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
                    "_id": "559a1d4afd69a2071deac881",
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
                    "_id": "559a1d4afd69a2071deac883"
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
            "publishedAt": "2015-07-06T06:16:42.049Z"
        },
        {
            "_id": "559cbd81ec2d61f2798a1fda",
            "modifiedAt": "2015-07-08T06:04:49.208Z",
            "createdAt": "2015-07-08T06:04:49.208Z",
            "sortId": 99999,
            "cookingType": "ready to eat",
            "sideDishType": "main",
            "setType": "single",
            "difficulty": 2,
            "time": 15,
            "servings": 1,
            "priceOriginal": 48,
            "__v": 0,
            "statisticViews": 0,
            "statisticLikeUserList": [],
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
                    "_id": "559cbd81ec2d61f2798a1fdf",
                    "foodMaterial": [
                        {
                            "dish": "5583b7faa2845dec35276b92",
                            "_id": "559cbd81ec2d61f2798a1fe1",
                            "default": true
                        },
                        {
                            "dish": "5583b7faa2845dec35276b93",
                            "_id": "559cbd81ec2d61f2798a1fe0",
                            "default": false
                        }
                    ],
                    "name": {
                        "zh": "牛肉",
                        "en": "beef"
                    }
                },
                {
                    "_id": "559cbd81ec2d61f2798a1fdb",
                    "foodMaterial": [
                        {
                            "dish": "5583b7faa2845dec35276b94",
                            "_id": "559cbd81ec2d61f2798a1fde",
                            "default": true
                        },
                        {
                            "dish": "5583b7faa2845dec35276b95",
                            "_id": "559cbd81ec2d61f2798a1fdd",
                            "default": false
                        },
                        {
                            "dish": "5583b7faa2845dec35276b96",
                            "_id": "559cbd81ec2d61f2798a1fdc",
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
                    "_id": "559cbd81ec2d61f2798a1fe2"
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
                    "_id": "559cbd81ec2d61f2798a1fe4",
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
                    "_id": "559cbd81ec2d61f2798a1fe3",
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
                    "_id": "559cbd81ec2d61f2798a1fe6",
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
                    "_id": "559cbd81ec2d61f2798a1fe5",
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
                    "_id": "559cbd81ec2d61f2798a1fe8",
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
                    "_id": "559cbd81ec2d61f2798a1fe7",
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
                    "_id": "559cbd81ec2d61f2798a1fe9"
                }
            ],
            "cover": [],
            "brief": {
                "zh": "优质澳洲M7和牛，摒弃任何额外调料及预处理，真材实料的本味质感，搭配满满一大捧新鲜山野的茶树菇，热力激荡下，茶树菇吸饱了牛肉的精华，更显肉感十足，咬上一口，丰沛的汁水瞬间爆破开来，口口生香，自在于心。",
                "en": "The high quality of Australian M7 Wagyu beef requires no marination in advance, fried with fresh poplar mushrooms to sear the flavor and aroma in a perfect way.  Stir-frying makes the cooking easy and quick. Finishing with the chef’s special sauce flavored with cumin gives an extra kick to the whole dish."
            },
            "title": {
                "zh": "干煸茶树菇孜然雪花牛柳6-10",
                "en": "Stir-fried Marbled Beef with Poplar Mushroom and Cumin Sauce"
            },
            "isPublished": true,
            "publishedAt": "2015-07-08T06:04:49.165Z"
        }
    ],
    "dishList": [
        {
            "dish": "558a602a3eba152266ff2b8c",
            "number": 1,
            "_id": "559cc7f766835c3486630d7a",
            "subDish": [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1,
                    "_id": "559cc7f766835c3486630d7d"
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1,
                    "_id": "559cc7f766835c3486630d7c"
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2,
                    "_id": "559cc7f766835c3486630d7b"
                }
            ]
        },
        {
            "dish": "559cbd81ec2d61f2798a1fda",
            "number": 1,
            "_id": "559cc7f766835c3486630d76",
            "subDish": [
                {
                    "dish": "5583b7faa2845dec35276b92",
                    "number": 1,
                    "_id": "559cc7f766835c3486630d79"
                },
                {
                    "dish": "5583b7faa2845dec35276b95",
                    "number": 1,
                    "_id": "559cc7f766835c3486630d78"
                },
                {
                    "dish": "5583b7faa2845dec35276b97",
                    "number": 2,
                    "_id": "559cc7f766835c3486630d77"
                }
            ]
        }
    ],
    "status": "not paid",
    "isPaymentPaid": false,
    "address": {
        "geoLatitude": 30,
        "geoLongitude": 30,
        "country": "",
        "province": "shanghai",
        "city": "shanghai",
        "district": "shanghai",
        "street": "shanghai",
        "address": "xxxxx",
        "contactPerson": "wangyupeng",
        "mobile": "13564568304",
        "remark": "comment",
        "isValid": false
    },
    "childOrderList": [
        "559cc7f766835c3486630d73",
        "559cc7f766835c3486630d74"
    ],
    "isSplitOrder": true,

    "paymentWeixinpay" : {
        "code_url"   : undefined,
        "prepay_id"  : "wx201507291424493fb57c4ff60654415824",
        "trade_type" : "JSAPI",
        "sign"       : "DB50748CB01423AEA8DDF55AD5748BA7",
        "nonce_str"  : "CglcZsmsAURjlVON",
        "mobileSign" : {
            "paySign"   : "ED4613F35255A22C600CF789A4373EB4",
            "signType"  : "MD5",
            "package"   : "prepay_id=wx201507291424493fb57c4ff60654415824",
            "nonceStr"  : "CglcZsmsAURjlVON",
            "timeStamp" : "1438151090",
            "appId"    : "wx37a1323e488cef84"
        },
        "nativeSign" : {
            "sign"         : "713E9FD6880B523961A3ABB1D8878D1C",
            "timeStamp"    : "1438151090",
            "nonceStr"     : "CglcZsmsAURjlVON",
            "packageValue" : "Sign=WXPay",
            "prepayId"     : "wx201507291424493fb57c4ff60654415824",
            "partnerId"    : "1260182401",
            "appId"        : "wxc31508f4ded1402b"
        }
    }
}
