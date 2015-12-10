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
            return state.concat([action.address])
        case types.PUT_ADDRESS:
            if (action.status == 'success') {
                return state.map (item =>
                    action.id == item._id ? action.address : item
                )
            }
            return state
        case types.DEL_ADDRESS:
            return state.filter(address => address._id != action.id)
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
        default: return state
    }
}

var addressReducer = combineReducers({addresses, addressEditingForm})

export default addressReducer