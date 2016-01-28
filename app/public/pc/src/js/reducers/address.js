import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'
import {allIsEatInCart} from '../utils/dish'


function addresses(state = null, action) {
    switch (action.type) {
        case types.SELECT_ADDRESS:
            return state.map(item => {
                item.selected = item._id == action.id
                return item
            })
        case types.GET_ADDRESS:
            if (action.status == 'success') {
                if (action.allIsEat) {
                    action.addresses.forEach(el => {
                        el.outOfRange = !el.isAvailableForEat
                    })
                }
                action.addresses.some(el => {
                    if (el.isDefault) {
                        if (!el.outOfRange) {
                            el.selected = true
                        }
                        return true
                    }
                })
                return action.addresses
            }
            return state
        case types.POST_ADDRESS:
            if (action.status == 'success') {
                return state.concat([action.address])
            }
            return state
        case types.PUT_ADDRESS:
            if (action.status == 'success') {
                return state.map (item => {
                    return action.address._id == item._id ? action.address : item
                })
            }
            return state
        case types.DEL_ADDRESS:
            return state.filter(address => address._id != action.id)
        case types.CART_SELECTION_CHANGED:
            // 根据菜品的库存状况过滤出可用地址(食材包,便当的种类信息, 便当的话还要提供都有货的仓库信息)
            var info = action.info
            if (info['ready to eat']) {
                return state.map(item => {
                    item.outOfRange = !item.isAvailableForEat
                        || !info.warehouse[item.warehouse]
                    return item
                })
            } else {
                if (info.allIsEat) {
                    return state.map(item => {
                        item.outOfRange = !item.isAvailableForEat
                        return item
                    })
                }
                return state.map(item => {
                    item.outOfRange = false
                    return item
                })
            }
        case types.FETCH_USER:
            if (action.status == 'success' && state) {
                if (allIsEatInCart(action.user.shoppingCart)) {
                    return state.map(el => {
                        el.outOfRange = !el.isAvailableForEat
                        return el
                    })
                } else return state
            }
            return state


        default: return state
    }
}

function addressEditingForm(state = {
    show: false,
    id: ''

}, action) {
    switch (action.type) {
        case types.EDIT_ADDRESS:
            return {
                show: true,
                id: action.id || ''
            }
        case types.POST_ADDRESS:
        case types.PUT_ADDRESS:
            return action.status == 'success' ? {show: false} : state
        case types.CLOSE_EDIT_ADDRESS:
            return {show: false}
        default: return state
    }
}

function streetList(state = {
    show: false,
    streets: []
}, action) {
    switch (action.type) {
        case types.GET_STREET:
            if (action.status == 'success') {
                return {
                    show: true,
                    streets: action.streets
                }
            }
            return state
        case types.TOGGLE_STREET:
            return {
                ...state,
                show: action.show === undefined ? !state.show : action.show
            }
        case types.CLEAR_STREET:
            return {
                show: false,
                streets: []
            }

        default: return state
    }
}

function range(state = [], action) {
    switch (action.type) {
        case types.GET_RANGE:
            if (action.status == 'success') {
                return action.range
            }
            return state
        default: return state
    }
}

var addressReducer = combineReducers({addresses, addressEditingForm, streetList, range})

export default addressReducer