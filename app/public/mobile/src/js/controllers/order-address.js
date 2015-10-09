angular.module('xw.controllers').controller('orderAddressCtrl', function (
    Weixin, $scope, User, Map, Address, $location, $localStorage) {

    var css = $scope.css = {
        cur: 0,
        edit: -1,
        showFakeInput: true,
        refForm: null,
        showSearchAddress: false
    };

    var data = $scope.data = {
        street: '',
        streetList: null
    };

    var emptyAddr = {
        contactPerson: '',
        mobile: '',
        province: '',
        city: '',
        street: '',
        address: '',
        geoLatitude: 0,
        geoLongitude: 0
    };
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
        else css.showFakeInput = false;
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
                    return (!!address.city && !!address.location )
                });
            })
        }
    };

    $scope.locate = function (event) {
        event.stopPropagation();

        Weixin.getLocation(function (res) {
            Weixin.getLocationName(res.latitude, res.longitude).then(function (data) {
                var result = data.data.result;
                result = angular.pick(result.addressComponent, 'province', 'city', 'district', 'street');
                fixAddress(result);
                result.geoLatitude = res.latitude;
                result.geoLongitude = res.longitude;

                angular.extend(newAddr, result);

                Map.distance(res.latitude, res.longitude).then(function (res) {
                    newAddr.isInRange = res.isInRange;
                    newAddr.distance = res.distance;
                })
            })
        })
    };

    $scope.next = function () {
        var addr = css.cur == -2 ? newAddr : $scope.address[css.cur];
        if (css.edit != -1 && !save(true)) return;

        var eatList = $localStorage.confirmedCart.eatList;
        if (!addr.isInRange && eatList && eatList.length) {
            alert('当前地址不在便当的配送范围内');
            return;
        }

        $localStorage.orderAddress = addr;

        setTimeout(function () {
            location.href = 'orderpay';
        }, 200);
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
        addr.district = street.district;
        addr.isInRange = false;
        addr.distance = Map.bentoNoReach;
        Map.distance(addr.geoLatitude, addr.geoLongitude).then(function (res) {
            addr.isInRange = res.isInRange;
            addr.distance = res.distance;
        })
    };

    function save(isNext) {
        if (!css.refForm) return true;
        if (css.refForm.$invalid) {
            return !isNext && css.cur == -2
        }

        if (css.cur == -2) { //是新增地址
            $scope.user.address.push(newAddr);
            newAddr = $scope.newAddr = angular.copy(emptyAddr)
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

    var districts = [], cities, provinces;
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

                return Map.distances($scope.address.map(function (addr) {
                    return {
                        lat: addr.geoLatitude,
                        lng: addr.geoLongitude
                    }
                }))
            } else {
                css.cur = -2;
            }

        }).then(function (res) {
            if (typeof res != 'object') return;
            $scope.address.forEach(function (addr, i) {
                addr.isInRange = res[i].isInRange;
                addr.distance = res[i].distance;
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