import $ from 'jquery'
import '../utils/config.js' //ajax setting with access_token


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
    }, {});

    $('.menus > li, .eatlist > li, .product-info').each(function () {
        var $li = $(this);
        var id = $li.data('id');
        if (cartObj[id]) {
            $li.find('.plusok')
                .html(cartObj[id].number).addClass('show');
            $li.find('.mius').show();
        }
    });

    var mobile = res.mobile;
    $('#signin').hide();
    $('#account').show().html(mobile.substr(0, 3) + '****' + mobile.substr(7, 4))
});

function postCart(_cart) {
    $.post('/api/user/shoppingcart', JSON.stringify({
        shoppingCart: _cart
    })).then(function (res) {
        cart = res.shoppingCart;
    })
}

$(document).ready(function () {
    // 添加值购物车事件绑定
    $('.menus, .eatlist, .buy').on('click', '.plus, .mius', function () {
        var _cart;
        var $btn = $(this);
        if (!cart) {
            location.href = '/sign';
            return;
        }

        var $li = $btn.closest('li, .product-info');
        var id = $li.data('id');
        var exist = false;
        var emptyArray = [];

        var isAdd = $btn.hasClass('plus');
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
            _number = 1;
            $btn.siblings('.mius').show();
        }

        // 减去一个购物车中不存在的菜品
        if (!isAdd && !exist) return;

        var el = $li.find('.plusok').addClass('show');
        el.html(_number);

        // 如果购物车中的商品被删掉了
        if (oldLength > newLength) {
            el.removeClass('show');
            $btn.hide();
        }

        postCart(_cart)
    })

    // tab切换事件绑定
    var $tabs = $('.tabs > div');
    var $tabBtnContainer = $('.tabbtn');
    var $tabBtns = $tabBtnContainer.children()
    $tabBtnContainer.on('click', function (e) {
        var index = $(e.target).index()
        $tabBtns.removeClass('act').eq(index).addClass('act')
        $tabs.hide().eq(index).show()
    })
})
