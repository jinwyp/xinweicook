angular.module('xw.controllers').controller('promotion01', function (Coupon, $scope, Debug, Alert, User) {

    $scope.exchange = function (code) {
        var card;
        $scope.cards.some(function (el) {
            if (el.code == code) {
                card = el;
                return true;
            }
        })
        if (!card || card.exchanged) return;
        Coupon.exchangeCouponCode(code).then(function () {
            card.exchanged = true;
            alert('兑换成功!')
        }).catch(function () {
            alert('兑换失败')
        })
    };

    function init() {
        var cards = $scope.cards = [
            {
                name: '开工大吉券',
                price: 5,
                code: 'XWPRM00201'
            }
        ];

        User.getUserInfo().then(function (res) {
            res.data.couponList.forEach(function (el) {
                // for old name convention
                var code = el.name.zh.split(' ')[1]
                var exist;
                if (code) {
                    exist = cards.some(function (card) {
                        if (card.code == code) {
                            card.exchanged = true;
                            return true;
                        }
                    })
                }
                if (exist) return;
                cards.some(function (card) {
                    if (card.name == el.name.zh) {
                        card.exchanged = true;
                        return true;
                    }
                })
            })
        })
    }

    init();

});