angular.module('xw.services').provider('Debug', function () {
    var that = this;
    that.debugKey = 'debug';

    this.$get = function () {
        var isDebug = new RegExp('\\b' + that.debugKey + '\\b');
        isDebug = isDebug.test(location.search);
        return {
            //默认根据查询参数中到是否出现debug参数来判断
            isDebug: isDebug,
            alert: function (val) {
                if (this.isDebug) {
                    val = Object.prototype.toString.call(val) == "[object Object]"
                        ? JSON.stringify(val) : val;
                    alert(val);
                }
            }
        }
    }
});