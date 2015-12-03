import fetch, {post} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"


function signInSend() {
    return {
        type: types.SIGNIN_SEND
    }
}

function signInReceive(success) {
    return {
        type: types.SIGNIN_RECEIVE,
        success
    }
}

// todo: 失败的原因
export function signIn(data) {
    return function (dispatch) {
        dispatch(signInSend());
        return post("/api/user/token", {
            username: data.mobile,
            password: data.pwd,
            grant_type: 'password'
        }).then(res => dispatch(signInReceive(true)))
        .catch(() => dispatch(signInReceive(false)))
    }
}

function signUpSend() {
    return {
        type: types.SIGNUP_SEND
    }
}

function signUpReceive(success) {
    return {
        type: types.SIGNUP_RECEIVE,
        success
    }
}

// todo: 失败的原因
export function signUp(data) {
    return function (dispatch) {
        dispatch(signUpSend());
        return post("/api/user/signup", {
            mobile: data.mobile,
            pwd: data.pwd,
            code: data.smsCode
        }).then(res => dispatch(signUpReceive(true)))
        .catch(() => dispatch(signUpReceive(false)))
    }
}

