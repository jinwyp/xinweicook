angular.module('xw.directives').directive('addressList', function ($q) {
    return {
        restrict: 'E',
        scope: {
            // 外部传入的数据
            addresses: '=', // 待编辑的地址, 如果为空, 则表示是新地址
            range: '=', // 省市区数据
            watchAddress: '=save',
            editing: '='
        },
        templateUrl: 'address-list.html',
        link: function ($scope) {
            var data = $scope.data = {
                newAddress: {}
            };

            // 引用地址指令的内部函数
            var handler = $scope.handler = {
                save: [],
                leave: [],
                valid: []
            };

            $scope.editing = function () {
                if (!$scope.addresses) return false;
                return !!data.newAddress.edit
                    || $scope.addresses.some(function (addr) {
                        return addr.edit;
                    })
            };

            $scope.remove = function (idx) {
                $scope.addresses.splice(idx, 1);
                handler.save.splice(idx, 1);
                handler.leave.splice(idx, 1);
                handler.valid.splice(idx, 1);
            };

            // 此处监听发生在cur地址指令之外的click.
            // (如果是在cur指令上发生的click,则交给cur指令自己处理,此处忽略即可)
            // 这些click表明可能需要保存cur地址指令的数据(如果cur地址指令正处在edit阶段)
            // 并且需要切换地址指令们的cur状态
            $scope.watchAddress = function (event) {
                var target = event.target;
                var parent = target, cur;
                // 是否是从address指令上产生的click事件,如果是则定位其序号.
                do {
                    if (parent.className.indexOf('address-item') != -1) {
                        var addressNodes = parent.parentElement.children;
                        for (var i = 0, len = addressNodes.length; i < len; i++) {
                            if (addressNodes[i] == parent) {
                                cur = i;
                                break;
                            }
                        }
                    }
                } while (parent = parent.parentElement);

                // 从addresses数据中找出正在处在编辑状态的地址序号
                var editIdx = -1;
                var curIdx = -1;
                $scope.addresses.forEach(function (address, i) {
                    if (address.edit) {
                        editIdx = i;
                    }
                    if (address.cur) {
                        curIdx = i;
                    }
                });

                // 忽略从cur指令上产生的click事件.
                if (cur == curIdx ||
                    (cur == $scope.addresses.length && data.newAddress.cur))
                    return;

                // 保存
                var promise;
                if (editIdx != -1) {
                    if (handler.valid[editIdx]()) {
                        promise = handler.save[editIdx]()
                    } else {
                        // 阻止离开当前地址指令,并阻止其他地址指令响应click事件.
                        return event.stopPropagation();
                    }
                } else if (data.newAddress.edit) {
                    if (handler.valid.newAddress()) {
                        promise = handler.save.newAddress().then(function (address) {
                            $scope.addresses.push(address);
                            data.newAddress = {};
                            return address;
                        });
                    } else {
                        return event.stopPropagation();
                    }
                }

                // 离开
                if (curIdx != -1) {
                    handler.leave[curIdx]();
                    if (editIdx == -1)
                        promise = $q.resolve($scope.addresses[curIdx]);
                } else if (data.newAddress.cur) {
                    handler.leave.newAddress();
                }

                // 如果是保存那这就是promise,否则不是.
                return promise;
            };
        }
    }
});