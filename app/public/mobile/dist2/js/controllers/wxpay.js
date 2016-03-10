angular.module('xw.controllers').controller('wxpayCtrl', wxpayCtrl);

function wxpayCtrl($scope, Orders, Debug, $localStorage) {


    // fail1 订单号异常, fail2 支付失败, fail3 支付失败之跨号支付
    $scope.state = 'processing';
    $scope.showShareInfo = true;


    function init() {
        var paths = location.href.split('/');
        var orderId = paths[paths.length - 1];
        var paid = false;

        if (orderId == 'NOORDERID') { // NOORDERID来自二维码
            if ($localStorage.orderId) {
                orderId = $localStorage.orderId;
                delete $localStorage.orderId;
            }
            if ($localStorage.chargeOnline) {
                delete $localStorage.chargeOnline;
                orderId = 'CHARGEBALANCE'
            }
        }

        if (orderId == 'CHARGEBALANCE') {
            if ($localStorage.wxInfo) {
                $scope.showShareInfo = false;
                var wxInfo = $localStorage.wxInfo;
                delete $localStorage.wxInfo;

                function onBridgeReady() {

                    WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                            "appId": wxInfo.appId, //"wx37a1323e488cef84",     //公众号名称，由商户传入
                            "timeStamp": wxInfo.timeStamp,         //时间戳，自1970年以来的秒数
                            "nonceStr": wxInfo.nonceStr, //随机串
                            "package": wxInfo.package,
                            "signType": wxInfo.signType,         //微信签名方式：
                            "paySign": wxInfo.paySign //微信签名
                        },
                        function (res) {
                            if (/\bok\b/.test(res.err_msg)) {
                                $scope.$apply(function () {
                                    $scope.state = 'success';
                                    setTimeout(function () {
                                        location.href = '/mobile/balance';
                                    }, 2000);
                                });
                            } else {    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                                Debug.alert('支付失败');
                                Debug.alert(res);
                                $scope.$apply(function () {
                                    $scope.state = 'fail2';
                                    //  跨号支付
                                    if (typeof res.err_desc == 'string' &&
                                        res.err_desc.indexOf('跨号') != -1) {
                                        $localStorage.orderId = orderId;
                                        $localStorage.chargeOnline = true;
                                        alert(res.err_desc);
                                        $scope.state = 'fail3';
                                    }
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
            } else {
                alert('支付失败:无余额充值信息');
            }
            return;
        }

        if (!/^\w{24}$/.test(orderId)) {
            alert('支付失败, 请稍后重试');
            $scope.state = 'fail1';
            return;
        }

        Debug.alert('订单ID' + orderId);
        Orders.getUnifiedOrder({
            _id: orderId,
            trade_type: 'JSAPI'
        }).then(function (res) {
            $scope.order = res.data;
            var wxInfo = res.data.paymentWeixinpay.mobileSign;
            // todo: weixin h5 pay https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=7_7
            function onBridgeReady() {
                if (paid) return;
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
                        if (/\bok\b/.test(res.err_msg)) {
                            delete $localStorage.confirmedBag;
                            Orders.updateOrder(orderId, {isPaymentPaid: 'true'});
                            $scope.$apply(function () {
                                $scope.state = 'success';
                            });
                        } else {    // 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
                            Debug.alert('支付失败');
                            Debug.alert(res);
                            Orders.updateOrder(orderId, {isPaymentPaid: 'false'});
                            $scope.$apply(function () {
                                $scope.state = 'fail2';
                                //  跨号支付
                                if (typeof res.err_desc == 'string' &&
                                    res.err_desc.indexOf('跨号') != -1) {
                                    $localStorage.orderId = orderId;
                                    alert(res.err_desc);
                                    $scope.state = 'fail3';
                                }
                            });
                        }
                    }
                );
                paid = true;
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
            Debug.alert(res);
            setTimeout(function () {
                Orders.getOrder(orderId).then(function (order) {
                    if (order.status == 'paid') {
                        $scope.state = 'success'
                    } else {
                        Orders.getOrder(orderId + encodeURIComponent(navigator.userAgent));
                        //alert('亲,生成订单出了点意外,请在 我的订单 中重新支付!');
                        //setTimeout(function () {
                        //    location.href = '/mobile/orderlist';
                        //}, 100);
                    }
                })
            }, 1000);
        })
    }
    init();
}
