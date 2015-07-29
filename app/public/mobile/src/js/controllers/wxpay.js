angular.module('xw.wxpay').controller('wxpayCtrl', wxpayCtrl);

function wxpayCtrl($scope, $localStorage, Orders, Weixin) {

    $scope.state = 'processing';


    function init() {
        var paths = location.href.split('/');
        var orderId = paths[paths.length - 1];

        Orders.getJsconfig(location.href.substr(0, location.href.length - location.hash.length)).then(function (res) {
            alert('获取jsconfig成功');
            var setting = {
                nonceStr :res.data.noncestr,
                timestamp: res.data.timestamp,
                signature: res.data.signature
            };
            Weixin.config(setting);
        });

        Orders.getUnifiedOrder({
            _id: orderId,
            trade_type: 'JSAPI'
        }).then(function (res) {
            alert('生成统一订单成功');
            Weixin.ready(function () {
                alert('weixin.config ready');
                try {
                    var wxInfo = res.data.paymentWeixinpay.mobileSign;
                    $scope.order = res.data;

                    Weixin.pay({
                        timestamp: wxInfo.timeStamp,
                        nonceStr: wxInfo.nonceStr,
                        signType: wxInfo.signType,
                        package: wxInfo.package,
                        paySign: wxInfo.paySign,
                        success: function () {
                            alert('pay success');
                            $scope.$apply(function () {
                                $scope.state = 'success';
                                setTimeout(function () {
                                    location.href = '/mobile'
                                }, 3000);
                            });
                        },
                        fail: function () {
                            alert('pay fail');
                            $scope.$apply(function () {
                                $scopoe.state = 'fail';
                            })
                        }
                    })
                } catch (e) {
                    alert('调用weixinpay失败');
                }
            });

        }).catch(function (res) {
            alert(res.data);
            alert('生成订单失败!');
        })
    }
    init();
}
