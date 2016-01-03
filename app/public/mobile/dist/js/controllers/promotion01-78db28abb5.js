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
                name: '满50减8',
                price: 8,
                code: 'XWPRM00101'
            },
            {
                name: '满100减10',
                price: 10,
                code: 'XWPRM00102'
            },
            {
                name: '满180减15',
                price: 15,
                code: 'XWPRM00103'
            },
            {
                name: '满250减20',
                price: 20,
                code: 'XWPRM00104'
            },
            {
                name: '满350减35',
                price: 35,
                code: 'XWPRM00105'
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