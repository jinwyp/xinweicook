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

function signInUi(state = {
    mobileErr: false,
    pwdErr: false,
    sending: false,
    success: false,
    failed: false
}, action) {
    switch (action.type) {
        case types.SIGNIN_SEND:
            return {sending: true}
        case types.SIGNIN_RECEIVE:
            return {
                sending: false,
                success: action.success,
                failed: !action.success
            }
        default:
            return state;
    }
}

function signUpValue(state = {
    mobile: '',
    smsCode: '',
    pwd: '',
    rePwd: ''
}, action) {
    switch (action.type) {
        default:
            return state;
    }
}

function signUpUi(state = {
    mobileErr: false,
    smsCodeErr: false,
    pwdErr: false,
    rePwd: false,
    sending: false
}, action) {
    switch (action.type) {
        case types.SIGNUP_SEND:
            return {sending: true}

        default:
            return state
    }
}

var signReducer = combineReducers({
    signInValue, signInUi, signUpValue, signUpUi
})

export default signReducer

