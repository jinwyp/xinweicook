angular.module('xw.wxpay').controller('Wxpay', wxpayCtrl);

function wxpayCtrl($scope, $localStorage, Orders, Weixin) {




    function init() {
        var orderId = location.search.substring(location.search.indexOf('=') + 1);
        Orders.getOrder(orderId).then(function (res) {
            var wxInfo = res.weixin;
            Weixin.pay({
            })
        })

    }

    init();
}
