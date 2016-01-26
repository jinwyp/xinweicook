import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'


function cook(state = {
    timeList: [],
    selectedTime: null,
    cookingType: 'ready to cook'
}, action) {
    return _reducer(state, action, 'ready to cook')
}

function eat(state = {
    timeList: [],
    selectedTime: null,
    cookingType: 'ready to eat'
}, action) {
    return _reducer(state, action, 'ready to eat')
}

function _reducer(state, action, cookingType) {
    switch (action.type) {
        case types.GET_TIME:
            if (action.status == 'success' && action.cookingType == cookingType) {
                return {...state, timeList: action.timeList}
            }
            return state
        case types.SELECT_TIME:
            if (action.cookingType == cookingType) {
                return {...state, selectedTime: action.time}
            }
            return state
        case types.CART_SELECT_ONE:
            if (!action.select) {
                return {...state, selectedTime: null}
            }
            return state
        default: return state
    }
}

var timeReducer = combineReducers({cook, eat})

export default timeReducer