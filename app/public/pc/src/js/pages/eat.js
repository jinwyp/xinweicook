(function () {
    "use strict";

    var cartObj;
    var cart;

    // load cart
    $.get('/api/user').then(function (res) {
        cart = res.shoppingCart;
        cartObj = cart.reduce(function (obj, item) {
            var id = item.dish._id;
            if (!obj[id]) {
                obj[id] = item
            }
            return obj
        }, {})

        $('.menus > li').each(function () {
            var $li = $(this)
            var id = $li.data('id')
            if (cartObj[id]) {
                $li.find('.plusok')
                    .html(cartObj[id].number).addClass('show')
            }
        })

        var mobile = res.mobile
        $('#signin').html(mobile.substr(0, 3) + '****' + mobile.substr(7, 4))
    })

    function postCart(_cart) {
        $.post('/api/user/shoppingcart', JSON.stringify({
            shoppingCart: _cart
        })).then(function (res) {
            cart = res.shoppingCart;
        })
    }

    $(document).ready(function () {
        $('.menus, .eatlist').on('click', '.plus, .mius', function (event) {
            var _cart;
            if (!cart) {
                location.href = '/sign';
                return;
            }

            var $li = $(this).closest('li');
            var id = $li.data('id');
            var exist = false;
            var emptyArray = [];

            var isAdd = $(event.target).hasClass('plus');
            var _number;
            var oldLength = cart.length;
            var newLength;

            _cart = cart.map(function (item) {
                var number = item.number;
                if (id == item.dish._id) {
                    if (isAdd) number++;
                    else number--;
                    _number = number;
                    exist = true;
                }
                return {
                    dish: item.dish._id,
                    number: number,
                    subDish: emptyArray
                }
            }).filter(function (item) {return !!item.number})

            newLength = _cart.length;

            // 添加一个不存在购物车中的菜品到购物车
            if (isAdd && !exist) {
                _cart.push({
                    dish: id,
                    number: 1,
                    subDish: emptyArray
                });
                _number = 1
            }

            // 减去一个购物车中不存在的菜品
            if (!isAdd && !exist) return;

            var el = $li.find('.plusok').addClass('show');
            el.html(_number);

            // 如果购物车中的商品被删掉了
            if (oldLength > newLength) {
                el.removeClass('show')
            }

            postCart(_cart)
        })
    })
}())


