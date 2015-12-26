import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'


function addresses(state = [], action) {
    switch (action.type) {
        case types.SELECT_ADDRESS:
            return state.map(item => {
                item.selected = item._id == action.id
                return item
            })
        case types.GET_ADDRESS:
            return action.status == 'success' ? action.addresses : state
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
            if (action.info['ready to eat']) {
                return state.map(item => {
                    item.outOfRange = !item.isAvailableForEat
                        || !action.info.warehouse[item.warehouse]
                    return item
                })
            } else {
                return state.map(item => {
                    item.outOfRange = false
                    return item
                })
            }

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