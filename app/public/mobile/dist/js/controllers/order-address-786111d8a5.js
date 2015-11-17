angular.module('xw.controllers').controller('orderAddressCtrl', function (
    Weixin, $scope, User, Map, Address, $location, $localStorage, Dishes) {

    var css = $scope.css = {
        cur: 0,//-2:当前表单为新地址表单
        edit: -1, //-1:不在编辑状态, -2:新地址表单正在编辑
        showFakeInput: true,
        refForm: null,
        showSearchAddress: false,
        locating: false
    };

    var data = $scope.data = {
        street: '',
        streetList: null
    };

    var emptyAddr = {
        contactPerson: '',
        mobile: '',
        province: '上海',
        city: '',
        street: '',
        address: '',
        geoLatitude: 0,
        geoLongitude: 0
    };

    var warehouse = $localStorage.warehouse;

    var newAddr = $scope.newAddr = angular.copy(emptyAddr);
    $scope.Address = Address;
    $scope.isWeixin = Weixin.isWeixin;

    $scope.options = function (province, city) {
        var len = arguments.length;
        if (len == 0) {
            return Address.map(function (el) {return el.Name})

        } else if (len == 1) {
            if (!province) return;
            //这里可以将结果缓存起来, 以节省len == 2时(以及以后可能相同)的多余计算
            return Address.filter(function (el) {
                return el.Name == province
            })[0].City.map(function (el) {return el.Name})

        } else if (len == 2) {
            if (!city) return;
            return Address.filter(function(el) {
                return el.Name == province
            })[0].City.filter(function (el) {
                    return el.Name == city
                })[0].Region.map(function (el) {return el.Name})
        }
    };

    $scope.choose = function (idx, event) {
        event.stopPropagation();
        // 如果另一个地址正在编辑,则先保存它
        if (css.edit != -1 && css.edit != idx) {
            if (!save()) return;
        }

        // 如果idx是-2则说明是新地址
        if (idx == -2) {
            css.edit = -2;
            css.cur = -2;
            return;
        }

        if (idx == css.cur) {
            css.edit = idx;
        } else {
            css.cur = idx;
            css.edit = -1;
        }
    };

    $scope.saveAndLeave = function () {
        // 如果正在编辑,但是却没有保存成功,就什么都不干
        if (css.edit != -1 && !save()) return;

        css.cur = css.edit == -1 ? css.cur : css.edit;
        css.edit = -1;
    };

    $scope.initForm = function (form, addr) {
        css.refForm = form;
        if (addr) css.showFakeInput = !addr.province;
        else css.showFakeInput = true;
    };

    $scope.showSearchAddress = function () {
        css.showSearchAddress = true;
        if (css.cur != -2) data.street = $scope.address[css.cur].street;
        else data.street = newAddr.street;
        $location.path('search-address');
        $scope.data.streetList && ($scope.data.streetList.length = 0);
        $scope.searchAddress();
    };

    $scope.searchAddress = function () {
        if (data.street) {
            var addr = css.cur == -2 ? newAddr : $scope.address[css.edit];
            Map.suggestion(data.street, addr.city || '全国')
                .then(function (res) {
                $scope.data.streetList = res.data.result.filter(function (address) {
                    return (!!address.city && !!address.location && address.name != '漕河泾' )
                });
            })
        }
    };

    $scope.locate = function (event) {

        css.locating = true;

        event.stopPropagation();

        Weixin.getLocation(function (res) {

            //console.log("weixinGeo:", res);

            Weixin.getLocationName(res.latitude, res.longitude).then(function (data) {

                //console.log("baiduGeo:", data.data);

                var result = data.data.result;
                result = angular.pick(result.addressComponent, 'province', 'city', 'district', 'street');
                fixAddress(result);
                result.geoLatitude = res.latitude;
                result.geoLongitude = res.longitude;

                angular.extend(newAddr, result);

                var warehouse = Map.nearestWarehouse(res.latitude, res.longitude);

                if (warehouse == 'caohejing1') {
                    var distance = Map.lineDistance2CHJ(res.latitude, res.longitude);
                    if (distance <= Map.topDistance.caohejing1) {
                        newAddr.isInRange = true;
                        newAddr.warehouse = 'caohejing1';
                        newAddr.distance = distance;
                        return;
                    }
                }

                Map.distance(res.latitude, res.longitude, warehouse).then(function (res) {
                    if (res.warehouse == 'caohejing1') {
                        newAddr.warehouse = 'caohejing1';
                        newAddr.isInRange = false;
                        newAddr.distance = res.distance;
                        return;
                    }

                    newAddr.isInRange = res.isInRange;
                    newAddr.distance = res.distance;
                    newAddr.warehouse = res.warehouse;
                });
            }).catch(angular.noop).then(function () {
                css.locating = false; // like finally
            })
        }, function () {
            css.locating = false;
        })
    };

    $scope.next = function () {
        if (!addressReady) {
            alert('正在计算配送距离,请稍候!');
            return;
        }
        var addr = css.cur == -2 ? newAddr : $scope.address[css.cur];
        if (css.edit != -1 && !save(true)) return;

        var eatList = $localStorage.confirmedBag.eatList;
        if (!addr.isInRange && eatList && eatList.length) {
            alert('当前地址不在便当的配送范围内');
            return;
        }

        var noStockEat = [];
        if (eatList.length && eatList[0].showForWarehouse != addr.warehouse && eatMenu) {
            eatList.forEach(function (dish) {
                var otherWarehouseDish = eatMenu[dish.dish.title.zh][addr.warehouse];
                if (!otherWarehouseDish || otherWarehouseDish.outOfStock) {
                    noStockEat.push(dish.dish);
                }
            })
        }

        if (noStockEat.length) {
            var sval = '您购物袋中的以下菜品可能无法配送至当前地址:\n';
            sval = noStockEat.reduce(function (str, cur) {
                return str + '  ' + cur.title.zh + '\n';
            }, sval);
            sval += '如果确实不能送达我们的客服会联系您';
            alert(sval);
        }

        $localStorage.orderAddress = addr;
        $localStorage.warehouse = addr.warehouse;

        setTimeout(function () {
            location.href = 'orderpay';
        }, 110);
    };

    $scope.confirmStreet = function (street) {
        $location.path('');
        if (!street) return;

        var addr = css.cur == -2 ? newAddr : $scope.address[css.cur];
        addr.street = street.name;
        street.location = Map.bd09ToGcj02(street.location);
        addr.geoLatitude = street.location.lat;
        addr.geoLongitude = street.location.lng;
        districts.some(function (d) {
            if (street.district.indexOf(d) != -1) {
                street.district = d;
            }
        });
        addr.district = street.district ? street.district : addr.district;
        addr.isInRange = false;
        addr.distance = Map.bentoNoReach;
        addressReady = false;

        if (Map.nearestWarehouse(addr.geoLatitude, addr.geoLongitude) == 'caohejing1') {
            var distance = Map.lineDistance2CHJ(addr.geoLatitude, addr.geoLongitude);
            var inRange = distance <= Map.topDistance.caohejing1;
            if (inRange) {
                addr.isInRange = true;
                addr.distance = distance;
                addr.warehouse = 'caohejing1';
                addressReady = true;
                return;
            }
        }

        Map.distance(addr.geoLatitude, addr.geoLongitude, warehouse).then(function (res) {
            if (addr.warehouse == 'caohejing1') {
                addr.isInRange = false;
                addr.distance = res.distance;
            } else {
                addr.isInRange = res.isInRange;
                addr.distance = res.distance;
                addr.warehouse = res.warehouse;
            }
            addressReady = true;
        }).catch(function () {
            addressReady = true;
        })
    };

    $scope.deleteAddress = function (idx, $event) {
        $event.stopPropagation();
        if (!confirm('确定删除该地址?')) return;
        $scope.address.splice(idx, 1);
        User.updateUser($scope.user);
        css.cur = 0;
    };

    function save(isNext) {
        if (!css.refForm) return true;
        if (css.refForm.$invalid) {
            return !isNext && css.cur == -2
        }

        if (css.cur == -2) { //是新增地址
            $scope.address.push(newAddr);
            newAddr = $scope.newAddr = angular.copy(emptyAddr);
            css.cur = $scope.address.length - 1;
        }

        User.updateUser($scope.user);

        css.showFakeInput = true;
        css.refForm = null;
        return true
    }

    function fixAddress(addr) {
        var obj = {
            province: provinces,
            city: cities,
            district: districts
        };
        Object.keys(obj).forEach(function (key) {
            if (!addr[key]) return;
            obj[key].some(function (el) {
                if (addr[key].indexOf(el) != -1) {
                    addr[key] = el;
                }
            })
        })
    }

    // 生成以title为key, {warehouse: dish}为value的对象
    function makeTitleDishMap(dishList) {
        return dishList.reduce(function (titleDishMap, dish) {
            var title = dish.title.zh;
            dish.showForWarehouse = dish.showForWarehouse || 'xinweioffice';
            if (!titleDishMap[title]) {
                titleDishMap[title] = {};
            }
            titleDishMap[title][dish.showForWarehouse] = dish;
            return titleDishMap
        }, {})
    }

    var districts = [], cities, provinces, addressReady = false, eatMenu;
    function init() {
        $scope.$on('$locationChangeStart', function () {
            var path = $location.path();
            css.showSearchAddress = path == '/search-address'
        });

        User.getUserInfo().then(function (res) {
            $scope.user = res.data;
            $scope.address = res.data.address;

            //规范化地址, 否则下拉框中出现的地址会有问题.
            provinces = Address.map(function (el) {return el.Name});
            cities = [];
            var push = cities.push;
            Address.forEach(function (province) {
                push.apply(cities, province.City.map(function (el) {
                    return el.Name;
                }));

                province.City.forEach(function (el) {
                    push.apply(districts, el.Region.map(function (it) {return it.Name}))
                })
            });
            $scope.address.forEach(function (addr) {
                provinces.some(function (lProvince) {
                    if (addr.province.indexOf(lProvince) != -1) {
                        addr.province = lProvince;
                        return true;
                    }
                });

                cities.some(function (lCity) {
                    if (addr.city.indexOf(lCity) != -1) {
                        addr.city = lCity;
                        return true;
                    }
                })
            });

            var hasDefault = $scope.address.some(function (el, i) {
                if (el.isDefault) {
                    $scope.address.splice(i, 1);
                    $scope.address.unshift(el);
                    return true;
                }
            });

            if ($scope.address.length) {
                if (!hasDefault) {
                    $scope.address[0].isDefault = true;
                }

                var addrOffice = $scope.address.filter(function (addr) {
                    var _warehouse = Map.nearestWarehouse(addr.geoLatitude,
                        addr.geoLongitude);
                    if (_warehouse == 'caohejing1') {
                        var distance = Map.lineDistance2CHJ(addr.geoLatitude, addr.geoLongitude);
                        var inRange = distance <= Map.topDistance.caohejing1;
                        if (inRange) {
                            addr.isInRange = true;
                            addr.warehouse = 'caohejing1';
                            addr.distance = distance;
                            return false;
                        } else addr.warehouse = 'xinweioffice';
                    } else {
                        addr.warehouse = 'xinweioffice';
                    }
                    return true;
                });

                // 在这里检查,如果购物车的存在一个便当,并且存在超过1个仓库,
                // 那么获取相应便当的菜品列表

                var tmpWarehouse = '';
                var eatList = $localStorage.confirmedBag.eatList;
                var hasEat = !!(eatList && eatList.length);
                var hasMultipleWarehouse = hasEat && $scope.address.some(function (addr) {
                    if (!tmpWarehouse) {
                        tmpWarehouse = addr.warehouse;
                    }
                    return addr.warehouse != tmpWarehouse
                });

                if (hasMultipleWarehouse) {
                    Dishes.getList('caohejing1', 'ready to eat').then(function (res) {
                        eatMenu = makeTitleDishMap(res.data);
                    })
                }


                if (addrOffice.length) {
                    return Map.distances(addrOffice.map(function (addr) {
                        return {
                            lat: addr.geoLatitude,
                            lng: addr.geoLongitude
                        }
                    }), warehouse);
                }
            }

        }).then(function (res) {
            addressReady = true;
            if (typeof res != 'object') return;

            $scope.address.filter(function (addr) {
                return addr.warehouse != 'caohejing1';
            }).forEach(function (addr, i) {
                if (typeof addr.isInRange != 'undefined') return;

                addr.isInRange = res[i].isInRange;
                addr.distance = res[i].distance;
                addr.warehouse = res[i].warehouse;
            })
        });

        Weixin.getJsconfig().then(function (res) {
            Weixin.config({
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            });
        })
    }



    init();
});