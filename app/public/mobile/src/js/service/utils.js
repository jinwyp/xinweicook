angular.module('xw.services').factory('Utils', function ($localStorage) {
    return {
        // todo: base64编码后的字符包括大小写字母各26各,以及数字,以及 + / = 这3个字符
        // 而 +(这个...) 和 / 在url中会被转义,因此需要再做替换,这里替换 + 为 - , / 替换为 _
        utf2b64: function (str) {
            return btoa(unescape(encodeURIComponent(str))).replace(/\+/g, '-').replace(/\//g, '_');
        },
        b642utf: function (str) {
            return decodeURIComponent(escape(window.atob(str.replace(/-/g, '+').replace(/_/g, '/'))));
        },

        // 两个购物车item是否是同一个,购物车item结构为:{dish:dish, number:, subDish:[]}
        isSameItemInCart: function (item1, item2) {
            return item1.dish._id == item2.dish._id && //主dish是否相同
                item1.subDish.every(function (a) { //子dish是否全部相同
                    return item2.subDish.some(function (b) {
                        return a.dish._id == b.dish._id
                    })
                }) && item1.subDish.length == item2.subDish.length;
        },

        // 合并本地购物车和线上购物车, 将数据全部合并到本地购物车.
        // local dish的数量(非dish.number)只会增加不会减少
        mergeCarts: function (local, server) {
            if (!local || !local.length) return server;
            var that = this;
            for (var i = 0; i < server.length; i++) {
                var notInLocal = local.every(function (lDish) {
                    return !that.isSameItemInCart(lDish, server[i])
                });
                if (notInLocal)
                   local.push(server[i]);
            }
            return local;
        },

        /**
         * 从/api/dishes获取到dish列表中抽取上线且有货的子属性菜品
         * @param dishList [{_id:., outOfStock: ., ..}]
         * @param type - 'main', or 'preference'
         * @returns [24位id, ..] 最小化localStorage的存储成本.(也许取末几位就可以)
         */
        getStockId: function (dishList, type) {
            var idStockMap = {};
            if (type == 'preference') {
                dishList.forEach(function (dish) {
                    dish.preferences.forEach(function (p) {
                        p.foodMaterial.forEach(function (f) {
                            if (!idStockMap[f.dish._id] && f.dish.isPublished) {
                                idStockMap[f.dish._id] = true;
                            }
                        })
                    })
                });
            } else {
                dishList.forEach(function (dish) {
                    if (!idStockMap[dish._id] && !dish.outOfStock) {
                        idStockMap[dish._id] = true;
                    }
                })
            }

            return Object.keys(idStockMap);
        },

        /**
         * localStorage实在是太大了,去掉多余的信息,只保留必要的信息.这些必要掉信息需要手动清除
         */
        cleanLocalStorage: function () {
            var remain = [ 'promotion', 'access_token', 'selectedAddress'];
            Object.keys($localStorage).forEach(function (key) {
                if (remain.indexOf(key) == -1 && key[0] != '$') {
                    delete $localStorage[key];
                }
            })
        },

        /**
         * 接收'?a=1&b=&c'这样的查询字符串,输出:{a:1, b:'', c: ''}
         * @param search - 如果没有则使用location.search
         * @returns {*}
         */
        searches: function (search) {
            search = search || location.search;
            return search.slice(1).split('&').reduce(function (obj, cur) {
                if (cur) {
                    cur = cur.split('=');
                    obj[cur[0]] = decodeURIComponent(cur[1] || '');
                }
                return obj;
            }, {});
        },

        /**
         * 确认两个地址是否相同,比如上海和上海市应该是相同的
         * @param addr1
         * @param addr2
         * @returns {boolean}
         */
        addressEqual: function (addr1, addr2) {
            addr1 = addr1 || '';
            addr2 = addr2 || '';
            if (!addr1 || !addr2) return false;
            return !addr1.indexOf(addr2) || !addr2.indexOf(addr1)
        },

        /**
         * 将老地址中的`徐汇`之类的转换成新地址的`徐汇区`
         * @param address - {province:.., city: .., district: ..}
         * @param ref - [从服务端拉取的地址数组, /api/../range]
         */
        regularizeAddress: function (address, ref) {
            var cities, districts;
            var equal = this.addressEqual;
            ref.some(function (state) {
                if (equal(address.province, state.state)) {
                    address.province = state.state;
                    cities = state.cities;
                    return true;
                }
            });

            cities && cities.some(function (city) {
                if (equal(address.city, city.city)) {
                    address.city = city.city;
                    districts = city.areas;
                    return true;
                }
            });

            districts && districts.some(function (district) {
                if (equal(address.district, district)) {
                    address.district = district;
                    return true;
                }
            });

            return address
        },

        /**
         * 基于服务端传回的配送范围数据,以空,或省,或市为参数来查询相应的子地区列表
         * @example call('浙江') - return ['杭州市', '宁波市', ..]; call(), - ret[全国省]
         * @param addresses - 服务端范围数据 /api/../range
         * @param province
         * @param city
         * @returns []
         */
        addressOptions: function (addresses, province, city) {
            var len = arguments.length;
            if (len == 1) {
                return addresses.map(function (el) {return el.state})

            } else if (len == 2) {
                if (!province) return;
                //这里可以将结果缓存起来, 以节省len == 2时(以及以后可能相同)的多余计算
                return addresses.filter(function (el) {
                    return el.state == province
                })[0].cities.map(function (el) {
                        return el.city;
                    })

            } else if (len == 3) {
                if (!city) return;
                return addresses.filter(function(el) {
                    return el.state == province
                })[0].cities.filter(function (el) {
                        return el.city
                    })[0].areas
            }
        },

        stockOfDish: function (dish, warehouse) {
            return dish.stockWarehouse.some(function (item) {
                return item.warehouse == warehouse && item.stock > 0;
            })
        },

        /**
         * 例如购物中的item {dish: {}, subDish: [..]}
         * @param item
         * @param warehouse
         */
        stockOfItem: function (item, warehouse) {
            var stockOfDish = this.stockOfDish;
            return stockOfDish(item.dish, warehouse) && !!item.subDish && item.subDish.every(function (el) {
                    return stockOfDish(el.dish, warehouse)
                })
        }
    }
});