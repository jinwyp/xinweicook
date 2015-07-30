angular.module('xw.wxpay').controller('wxpayCtrl', wxpayCtrl);

function wxpayCtrl($scope, $localStorage, Orders, Weixin) {


    $scope.debug = location.search === '?debug';
    $scope.debugData = [];
    $scope.state = 'processing';


    function init() {
        var paths = location.href.split('/');
        var orderId = paths[paths.length - 1];

        //Orders.getJsconfig(location.href.substr(0, location.href.length - location.hash.length)).then(function (res) {
        //    alert('获取jsconfig成功');
        //    var setting = {
        //        nonceStr :res.data.noncestr,
        //        timestamp: res.data.timestamp,
        //        signature: res.data.signature
        //    };
        //    Weixin.config(setting);
        //});

        Orders.getUnifiedOrder({
            _id: orderId,
            trade_type: 'JSAPI'
        }).then(function (res) {
            $scope.order = res.data;
            var wxInfo = res.data.paymentWeixinpay.mobileSign;

            // todo: weixin h5 pay https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7
            function onBridgeReady() {
                WeixinJSBridge.invoke(
                    'getBrandWCPayRequest', {
                        "appId": "wx37a1323e488cef84",     //公众号名称，由商户传入
                        "timeStamp": wxInfo.timeStamp,         //时间戳，自1970年以来的秒数
                        "nonceStr": wxInfo.nonceStr, //随机串
                        "package": wxInfo.package,
                        "signType": wxInfo.signType,         //微信签名方式：
                        "paySign": wxInfo.paySign //微信签名
                    },
                    function (res) {
                        try {
                            if (/\bok\b/.test(res.err_msg)) {
                                Orders.updateOrder(orderId, "true").then(function (res) {
                                    alert('更新订单状态成功');
                                    alert(JSON.stringify(res));
                                    $scope.debugData.push(res);
                                    setTimeout(function () {
                                        location.href = '/mobile'
                                    }, 2000);
                                }).catch(function (res) {
                                    alert('更新订单状态失败');
                                    alert(JSON.stringfy(res));
                                    $scope.debugData.push(res);
                                });
                                $scope.$apply(function () {
                                    $scope.state = 'success';
                                });
                            } else {    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                Orders.updateOrder(orderId, "false").then(function (res) {
                                    $scope.debugData.push(res);
                                }).catch(function (res) {
                                    $scope.debugData.push(res)
                                });
                                $scope.$apply(function () {
                                    $scope.state = 'fail';
                                })
                            }
                        } catch(e) {
                            alert('调用订单更新函数失败'); //todo
                            $scope.$apply(function () {
                                $scope.debugData.push(e);
                            });
                        }
                    }
                );
            }

            if (typeof WeixinJSBridge == "undefined") {
                if (document.addEventListener) {
                    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
                } else if (document.attachEvent) {
                    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
                    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
                }
            } else {
                onBridgeReady();
            }

        }).catch(function (res) {
            $scope.debugData.push(res);
            alert('生成订单失败!');
        })
    }
    init();
}
