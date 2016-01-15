import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'


export default function warehouse(state = '', action) {
    switch (action.type) {
        case types.SELECT_ADDRESS:
            return action.address.warehouse || ''

        default: return state
    }
}