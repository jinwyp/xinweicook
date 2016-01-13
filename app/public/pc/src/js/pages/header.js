import $ from 'jquery'
import {User} from '../models'

/**
 * 根据user对象来初始化头部
 * @param user
 */
export function init(user) {
    render(user && user.mobile, user && user.shoppingCart)
}

/**
 * @param mobile
 * @param cart - 这个cart不一定就是user上面的,它可能会改变
 */
export function render(mobile, cart) {
    var $signin = $('#signin')
    var $account = $('#account')
    var $accountParent = $account.parent()
    if (mobile) {
        $signin.hide()
        $account.html(mobile.substr(0, 3) + '****' + mobile.substr(7, 4))
        $accountParent.show()
        $('#signout').click(() => {
            User.logout().then(function () {
                location.reload()
            }).catch(e => console.log(e))
        })
    } else {
        $signin.show()
        $accountParent.hide()
    }
}

export function place(address) {
    $('#position').show().find('span').html(address)
}