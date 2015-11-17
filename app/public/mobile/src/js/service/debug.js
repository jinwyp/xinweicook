angular.module('xw.services').provider('Debug', function (Utils) {
    var that = this;
    that.debugKey = 'debug';

    this.$get = function () {
        var isDebug = new RegExp('\\b' + that.debugKey + '\\b');
        var fakeWarehouse = '';
        var searches = Utils.searches(location.search);
        isDebug = isDebug.test(location.search) || !!sessionStorage.getItem('debug');

        if (isDebug && !sessionStorage.getItem('debug')) {
            sessionStorage.setItem('debug', 'true');
        }
        if (isDebug) {
            if ('fakewarehouse' in searches) {
                fakeWarehouse = searches.fakewarehouse;
            }
        }

        var ret = {
            //默认根据查询参数中到是否出现debug参数来判断
            isDebug: isDebug,
            alert: function (val) {
                if (this.isDebug) {
                    console.log(val); // todo:怎么判断log是否有效?如果有效,似乎就没有多大必要调用alert了.
                    val = Object.prototype.toString.call(val) == "[object Object]"
                        ? JSON.stringify(val) : val;
                    alert(val);
                }
            },
            assert: function (express, sval) {
                if (this.isDebug) {
                    !express && alert(sval);
                }
            },
            promiseErrFn: function (msg) {
                return function(res) {
                    ret.alert(msg);
                    ret.alert(res);
                }
            },
            fakeWarehouse: fakeWarehouse
        };
        
        return ret
    }
});