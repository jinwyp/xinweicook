"use strict";

import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'

function showSelector(state = false, action) {
    switch (action.type) {
        case types.TOGGLE_POSITION_SELECTOR:
            if (action.state !== undefined)
                return action.state
            else return !action.state

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

function position(state = {}, action) {
    switch (action.type) {
        case types.SELECT_ADDRESS:
            return action.address
        case types.POST_ADDRESS:
            if (action.status == 'success') {
                return action.address
            }
            return state
        case types.PUT_ADDRESS:
            if (action.status == 'success') {
                return action.address
            }
            return state
        default: return state
    }
}

var positionReducer = combineReducers({
    showSelector, position
})

export default positionReducer