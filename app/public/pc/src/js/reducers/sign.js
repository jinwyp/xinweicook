import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'

function signInValue(state = {
    mobile: '',
    pwd: ''
}, action) {
    switch (action.type) {

        default: return state
    }
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

