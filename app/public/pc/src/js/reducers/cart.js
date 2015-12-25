import * as types from '../constants/ActionTypes'
import { hasStock } from '../utils/dish'

export default function cart(state = [], action) {
    switch (action.type) {
        case types.CART_PLUS_DISH:
            return state.map(item => {
                item._id == action.id && item.number++
                return item
            })
        case types.CART_MINUS_DISH:
            return state.map(item => {
                item._id == action.id && item.number--
                return item
            })
        case types.CART_DEL_DISH:
            return state.filter(item => item._id != action.id)
        // todo: 这里应当是购物车的action,但是购物车又是挂在user对象上,随着user获取而获取的
        case types.FETCH_USER:
            if (action.status == 'success') {
                return action.user.shoppingCart.map(item => {
                    item.noStock = !hasStock(item, action.warehouse)
                    return item
                })
            }
            return state
        case types.CART_SELECT_ONE:
            return state.map(item => {
                if (item._id == action.id) {
                    item.selected = !item.selected && !item.noStock
                }
                return item
            })
        case types.SELECT_ADDRESS:
            return state.map(item => {
                item.noStock = !hasStock(item, action.address.warehouse)
                item.selected = item.selected && !item.noStock
                return item
            })
        case types.CART_SELECT_ALL:
            var dishList = state.filter(item => item.dish.cookingType == action.cookingType);
            var isSelectedAll = !(dishList.every(item => item.selected || item.noStock)
                && dishList.some(item => item.selected))
            return state.map(item => {
                if (item.dish.cookingType == action.cookingType) {
                    item.selected = isSelectedAll && !item.noStock
                }
                return item
            })

        default: return state
    }
}
