import {User, Dish} from '../models'
import * as dishUtil from '../utils/dish'
import * as dishDom from '../dom/dish'

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
        if (!dishHash[id]) {
            dishHash[id] = {
                number: item.number,
                showMinus: !dishUtil.hasMultipleSelections(dish)
            }
        } else {
            dishHash[id] += item.number
        }
    })

    Object.keys(dishHash).forEach(id =>
        dishDom.render(id, dishHash[id].number, dishHash[id].showMinus))

    function plusDish(id) {
        // 根据id, 找出dish, 判断是否有多属性(如果多属性只有一个也没必要有选择框)
        var dish = dishUtil.getDish(dishes, id)

        var number = dishUtil.plusDish(dish, cart)
        if (!number) { // 数字不存在,表示不能直接添加,需要使用多属性框
            // todo
            console.warn('todo: to complete')
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