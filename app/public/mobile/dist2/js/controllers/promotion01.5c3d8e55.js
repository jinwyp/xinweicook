angular.module('xw.controllers').controller('promotion01.5c3d8e55', function (Coupon, $scope, Debug, Alert, User, $location) {

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
        var cards = $scope.cards = []
        //var cards = $scope.cards = [
        //    {
        //        name: '美丽公主礼券',
        //        price: 6,
        //        code: 'XWPRM00301'
        //    }, {
        //        name: '气场女王礼券',
        //        price: 6,
        //        code: 'XWPRM00302'
        //    }
        //];

        var path = $location.path()

        if (path == '/queen') {
            cards.push({
                name: '气场女王礼券',
                price: 6,
                code: 'XWPRM00302'
            })
        } else {
            $scope.cards.push(            {
                name: '美丽公主礼券',
                price: 6,
                code: 'XWPRM00301'
            })
        }

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