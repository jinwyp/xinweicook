import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'

function signInValue(state = {
    mobile: '',
    pwd: ''
}, action) {
    switch (action.type) {
        case types.SIGNIN_MOBILE_CHANGE:
            return {mobile: action.text}
        case types.SIGNIN_PWD_CHANGE:
            return {pwd: action.text}

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
        case types.SIGNIN_MOBILE_ERR:
            return {mobileERR: true}
        case types.SIGNIN_PWD_ERR:
            return {pwdErr: true}
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
        case types.SIGNUP_MOBILE_CHANGE:
            return {mobile: action.text}
        case types.SIGNUP_SMS_CODE_CHANGE:
            return {smsCode: action.text}
        case types.SIGNUP_PWD_CHANGE:
            return {pwd: action.text}
        case types.SIGNUP_REPWD_CHANGE:
            return {rePwd: action.text}
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
        case types.SIGNUP_MOBILE_ERR:
            return {mobileErr: true}
        case types.SIGNUP_SMS_CODE_ERR:
            return {smsCodeErr: true}
        case types.SIGNUP_PWD_ERR:
            return {pwdErr: true}
        case types.SIGNUP_REPWD_ERR:
            return {rePwd: true}
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

