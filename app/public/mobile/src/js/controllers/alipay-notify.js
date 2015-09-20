angular.module('xw.controllers').controller('alipayNotifyCtrl', function ($scope, Alipay, Debug, Orders) {

    init();

    function init() {
        var searches = location.search.slice(1).split('&');
        $scope.searches = searches.reduce(function (obj, cur) {
            cur = cur.split('=');
            obj[cur[0]] = decodeURIComponent(cur[1]);
            return obj
        }, {});

        Debug.alert($scope.searches);

        if ($scope.searches.trade_status == 'TRADE_FINISHED' ||
            $scope.searches.trade_status == 'TRADE_SUCCESS'
        ) {
            $scope.success = true;
            var orderId = $scope.searches['out_trade_no'];


            if (orderId.length == 24) {
                //充值
                setTimeout(function () {
                    location.href = '/mobile/balance';
                }, 2500);
            } else {
                Orders.updateOrder(orderId, {isPaymentPaid: 'true'}).then(function () {
                    Debug.alert('更新订单状态成功');
                    setTimeout(function () {
                        location.href = '/mobile/invite'
                    }, 2000);
                }).catch(function (res) {
                    alert('更新订单状态失败');
                    Debug.alert('订单状态更新失败');
                    Debug.alert(res);
                });
            }
        }
    }
});