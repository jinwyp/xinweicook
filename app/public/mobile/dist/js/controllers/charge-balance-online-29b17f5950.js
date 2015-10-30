angular.module('xw.controllers').controller('chargeBalanceOnlineCtrl', function ($localStorage, $scope, Debug, Alert, Balance, User) {

    var isWeiXin = /MicroMessenger/i.test(navigator.userAgent);
    var openid = '';
    var chargeSelections;

    $scope.chargeOnline = function () {
        //todo: 如果在微信里边,但是没有从用户对象上到openid,则需要先通过微信获取openid
        if (isWeiXin && !openid) {
            // todo: to be Completed
            // 访问微信服务器,通过用户授权,微信重定向到一个url,并附上wxstate和授权id,
            // 然后自己服务器拿着授权id再去问微信要openid,拿到后然后重定向用户请求到支付页面,
            // 然后浏览器端发起统一支付订单请求,返回后再调用微信api进行支付
            // 这里的问题在于:
            //  1.wxstate原来是orderid,但充值浏览器端并没有获取到一个orderid;
            //  2.而充值的统一支付订单这里无需浏览器主动发起.(问题:似乎需要在微信支付页面发起充值请求)
        }

        var data = {
            addAmount: chargeSelections[chargeSelections.selected].price,
            payment: isWeiXin ? 'weixinpay' : 'alipay direct',
            device_info: 'WEB',
            spbill_create_ip: '8.8.8.8',
            trade_type: 'JSAPI',
            url: '',
            openid: openid
        };

        Balance.chargeOnline(data).then(function (res) {
            if (!isWeiXin) {
                location.href = res.data.aliPaySign.fullurl;
                return;
            }

            $localStorage.wxInfo = res.data.weixinPayUnifiedOrder.wxPay_mobileSign;

            setTimeout(function () {
                location.href = '/mobile/wxpay/CHARGEBALANCE';
            }, 200);
        })
    };

    function init() {
        chargeSelections = $scope.chargeSelections = [
            {
                price: 300,
                coin: 350
            },
            {
                price: 500,
                coin: 600
            },
            {
                price: 1000,
                coin: 1250
            },
            {
                price: 2000,
                coin: 2600
            }
        ];
        $scope.chargeSelections.selected = 0;

        Balance.balance().then(function (res) {
            $scope.balance = res.data.balance;
        }).catch(Debug.promiseErrFn('查询余额失败'));

        User.getUserInfo().then(function (res) {
            var weixinId = res.data.weixinId;
            if (weixinId && weixinId.openid) {
                openid = weixinId.openid;
            }
        })
    }

    init();

});