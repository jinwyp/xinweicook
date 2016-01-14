"use strict";

import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'

function postStatus(state = {
    isSending: false,
    errInfo: ''
}, action) {
    switch (action.type) {
        case types.POST_ORDER:
            if (action.status == 'success')
                return {
                    isSending: false
                }
            else if (action.status == 'error')
                return {
                    isSending: false,
                    errInfo: action.error
                }
            else return {
                    isSending: true
                }

        default: return state
    }
}

function orders(state = [], action) {
    switch (action.type) {
        case types.GET_ORDERS:
            if (action.status == 'success') {
                return action.orders.filter(el => {
                    return !!el.dishList[0].dish
                })
            }
            return state
        default: return state
    }
}

var orderReducer = combineReducers({
    postStatus, orders
})

export default orderReducer