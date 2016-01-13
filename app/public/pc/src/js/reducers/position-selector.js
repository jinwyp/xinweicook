"use strict";

import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'

function showSelector(state = false, action) {
    switch (action.type) {
        case types.TOGGLE_POSITION_SELECTOR:
            if (action.state !== undefined)
                return action.state
            else return !action.state
        case types.SELECT_ADDRESS:
            return false
        // go through
        case types.PUT_ADDRESS:
        case types.POST_ADDRESS:
            if (action.status == 'success') {
                return false
            }
            return state

        default: return state
    }
}

function addressId(state = '', action) {
    switch (action.type) {
        case types.SELECT_ADDRESS:
            return action.id
        case types.POST_ADDRESS:
            if (action.status == 'success') {
                return action.address._id
            }
            return state
        case types.PUT_ADDRESS:
            if (action.status == 'success') {
                return action.address._id
            }
            return state
        case types.GET_ADDRESS:
            if (action.status == 'success') {
                var address = action.addresses.filter(el => el.isDefault)[0]
                if (address) {
                    return address._id
                }
                return state
            }
            return state
        default: return state
    }
}

var positionReducer = combineReducers({
    showSelector, addressId
})

export default positionReducer