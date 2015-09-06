angular.module('xw.controllers').controller('alipayNotifyCtrl', function ($scope, Alipay, Debug) {

    init();

    function init() {
        var searches = location.search.slice(1).split('&');
        $scope.searches = searches.reduce(function (obj, cur) {
            cur = cur.split('=');
            return obj[cur[0]] = decodeURIComponent(cur[1]);
        }, {});

        Debug.alert($scope.searches);

        if ($scope.searches.trade_status == 'TRADE_FINISHED' ||
            $scope.searches.trade_status == 'TRADE_SUCCESS'
        ) {
            $scope.success = true;
            Alipay.notify($scope.searches['out_trade_no']).then(function () {
                setTimeout(function () {
                    location.href = '/mobile/';
                }, 3000);
            }).catch(Debug.promiseErrFn('通知失败'));
        }
    }
});