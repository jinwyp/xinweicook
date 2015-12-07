(function () {
    // load cart
    $.get('/api/user').then(function (res) {
        window.cart = res.shoppingCart;
    })
}())
$(document).ready(function () {
    $('.menus').on('click', '.plus', function (event) {
        var cart = window.cart, _cart;
        if (!cart) {
            location.href = '/sign';
            return;
        }

        var $li = $(this).closest('li');
        var id = $li.data('id');
        var exist = false;
        var emptyArray = [];
        var _cart = cart.map(function (item) {
            var number = item.number;
            if (id == item.dish._id) {
                number++;
                exist = true;
            }
            return {
                dish: item.dish._id,
                number: number,
                subDish: emptyArray
            }
        });

        if (!exist) {
            _cart.push({
                dish: id,
                number: 1,
                subDish: emptyArray
            })
        }

        var el = $li.find('.plusok').addClass('show');
        setTimeout(function () {
            el.removeClass('show')
        }, 1000);

        $.post('/api/user/shoppingcart', JSON.stringify({
            shoppingCart: _cart
        })).then(function (res) {
            window.cart = res.shoppingCart;
        })
    })
})


