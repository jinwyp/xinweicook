import $ from 'jquery'
import {User, Dish} from '../models'
import * as dishUtil from '../utils/dish'
import * as dishDom from '../dom/dish'
import handlebars from 'handlebars/dist/handlebars'
import {propertySelection} from '../dom/templates'
import Modal from '../dom/modal'
import {emitter} from '../pages/common'

var _newAddress
var tmpListener

emitter.on(emitter.t.positionChanged, tmpListener = (newAddress) => {
    _newAddress = newAddress
})

/**
 * 对dish的基本操作做绑定,给首页,食材包,便当列表页,以及食材包详情页用
 * todo: 其实分离也许更好, 实在是太相似,所以放这里
 * @param cart
 * @param dishes
 * @param parent
 */
export default function (cart, dishes, parent) {
    dishDom.bind(parent,
        {plus: '.plus', minus: '.mius'},
        (event, id) => {plusDish(id)},
        (event, id) => {minusDish(id)}
    )

    var dishHash = {}
    cart.forEach(item => {
        var id = item.dish._id
        var dish = dishUtil.getDish(dishes, id)
        if (!dish) {
            console.warn('to be completed')
            return
        }
        if (!dishHash[id]) {
            dishHash[id] = {
                number: item.number,
                showMinus: !dishUtil.hasMultipleSelections(dish)
            }
        } else {
            dishHash[id].number += item.number
        }
    })

    Object.keys(dishHash).forEach(id =>
        dishDom.render(id, dishHash[id].number, dishHash[id].showMinus))

    // 多属性绑定
    bindPropertySelection(cart, dishes)

    if (_newAddress) {
        emitter.off(emitter.t.positionChanged, tmpListener)
        var warehouse = _newAddress.warehouse
        _renderOutOfRange(warehouse)
    }

    emitter.on(emitter.t.positionChanged, (newAddress, oldAddress) => {
        _renderOutOfRange(newAddress.warehouse)
    })

    function _renderOutOfRange(warehouse) {
        dishes.forEach(dish => {
            if (dish.cookingType == 'ready to cook') return
            dish.outOfRange = !warehouse || dish.stockWarehouseObj[warehouse] <= 0
            dishDom.renderOutOfRange(dish._id, !!dish.outOfRange)
        })
    }

    function plusDish(id) {
        // 根据id, 找出dish, 判断是否有多属性(如果多属性只有一个也没必要有选择框)
        var dish = dishUtil.getDish(dishes, id)
        if (dish.outOfRange) return

        var number = dishUtil.plusDish(dish, cart)
        if (!number) { // 数字不存在,表示不能直接添加,需要使用多属性框
            openPropertySelection(dish)
        } else { // 表示无需弹出多属性选择框
            User.postCartRelax(cart)
            dishDom.render(id, number, true)
        }
    }

    function minusDish(id) {
        var dish = dishUtil.getDish(dishes, id)
        var number = dishUtil.minusDish(dish, cart)
        User.postCartRelax(cart)
        dishDom.render(id, number)
    }
}

export function bindTab(tabs, tabsContainer, activeClass) {
    // tab切换事件绑定
    var $tabs = $(tabs);
    var $tabBtnContainer = $(tabsContainer);
    var $tabBtns = $tabBtnContainer.children()
    $tabBtnContainer.on('click', function (e) {
        var index = $(e.target).index()
        $tabBtns.removeClass(activeClass).eq(index).addClass(activeClass)
        $tabs.hide().eq(index).show()
    })
}

var compiledTpl
var modal
export function openPropertySelection(dish) {
    var id = dish.id
    if (!dish) throw Error(`can't find the dish with ${id} in dishes`)
    dish.number = 1

    if (!modal) {
        if (!compiledTpl) {
            compiledTpl = handlebars.compile(propertySelection)
        }
        modal = new Modal(compiledTpl(dish), id)
    }

    if (modal.id != id) {
        modal.replace(compiledTpl(dish), id)
    }

    modal.open()
}

function bindPropertySelection(cart, dishes) {
    // 1.select property, 2.add to cart & close, 3.number
    if (!modal) {
        if (!compiledTpl) {
            compiledTpl = handlebars.compile(propertySelection)
        }
        modal = new Modal()
    }

    modal.on('click', '.minus', function () {
        var $root = $(this).closest('.multi-dish-selection')
        if (!$root.find('.selected').length) return
        var id = $root.data('id')
        var dish = dishUtil.getDish(dishes, id)
        if (dish.number == 1) {
            return
        }
        dish.number--
        $root.find('.number').html(dish.number)
    })

    modal.on('click', '.plus', function () {
        var $root = $(this).closest('.multi-dish-selection')
        if (!$root.find('.selected').length) return
        var id = $root.data('id')
        var dish = dishUtil.getDish(dishes, id)
        dish.number++
        $root.find('.number').html(dish.number)
    })

    modal.on('click', '.properties li', function () {
        var $this = $(this)
        $this.parent().children().removeClass('selected')
        $this.addClass('selected')
    })

    modal.on('click', '.add-to-cart', function () {
        // 找出菜品, 找出它选择的那些多属性, 然后加入到购物车, 然后关闭窗口
        var $root = $(this).closest('.multi-dish-selection')
        var id = $root.data('id')
        var dish = dishUtil.getDish(dishes, id)
        // todo: 暂时简化成单个多属性,这个有点烦,以后解决
        $root.find('.selected').each(function () {
            var $this = $(this)
            var groupId = $this.parents('li').data('id')
            var propertyId = $this.data('id')

            dishUtil.plusDishWithProperty(dish, cart, groupId, propertyId)
            User.postCartRelax(cart)
        })

        var number = 0
        cart.filter(el => el.dish._id == id)
            .forEach(el => number += el.number)

        dishDom.render(id, number, false)

        modal.close()
    })
}


