import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'



function cart(state = {
    dishList: [],
    stockWarehouse: ''
}, action) {
    switch (action.type) {
        case types.CART_PLUS_DISH:
            return plusDish(action.id, state.dishList)
        case types.CART_MINUS_DISH:
            return minusDish(action.id, state.dishList)
    }
}

function plusDish(id, cart) {
    cart.some(item => {
        if (item._id == id) {
            item.number++
            return true
        }
    })
}

function minusDish(id, cart) {
    cart.some((item, i) => {
        if (item._id == id) {
            item.number--
            if (!item.number) {
                cart.splice(i, 1)
            }
            return true
        }
    })
}

function signUpValue(state = {
    mobile: '',
    smsCode: '',
    pwd: ''
}, action) {
    switch (action.type) {
        case types.SIGNUP_SEND:
            return {...action.data}
    default:
        return state;
    }
}


var signReducer = combineReducers({
    signInValue, signUpValue
})

export default signReducer

