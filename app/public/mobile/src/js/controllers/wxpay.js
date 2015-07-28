angular.module('xw.wxpay').controller('wxpayCtrl', wxpayCtrl);

function wxpayCtrl($scope, $localStorage, Orders, Weixin) {

    $scope.state = 'processing';


    function init() {
        var paths = location.href.split('/');
        var orderId = paths[paths.length - 1];


        Orders.getOrder(orderId).then(function (res) {
            Weixin.ready(function () {
                var wxInfo = res.weixinpayMobileSign;
                Weixin.pay({
                    timestamp: wxInfo.timeStamp,
                    nonceStr: wxInfo.nonceStr,
                    signType: wxInfo.signType,
                    package: wxInfo.package,
                    paySign: wxInfo.paySign,
                    success: function () {
                        $scope.$apply(function () {
                            $scope.state = 'success';
                            setTimeout(function () {
                                location.href = '/mobile'
                            }, 3000);
                        });
                    },
                    fail: function () {
                        $scope.$apply(function () {
                            $scopoe.state = 'fail';
                        })
                    }
                })
            });

        })
    }
    init();
}
