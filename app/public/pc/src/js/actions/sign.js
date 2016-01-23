import fetch, {post} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"


function signInSend(data) {
    return {
        type: types.SIGNIN_SEND,
        data
    }
}

// todo: 失败的原因
export function signIn(data) {
    return function (dispatch) {
        dispatch(signInSend(data));
        return post("/api/user/token", {
            username: data.mobile,
            password: data.pwd,
            grant_type: 'password'
        })
    }
}

function signUpSend(data) {
    return {
        type: types.SIGNUP_SEND,
        data
    }
}

// todo: 失败的原因
export function signUp(data) {
    return function (dispatch) {
        dispatch(signUpSend(data));
        return post("/api/user/signup", {
            mobile: data.mobile,
            pwd: data.pwd,
            code: data.smsCode
        })
    }
}


function resetPwdSend(data) {
    return {
        type: types.SIGNUP_SEND,
        data
    }
}

// todo: 失败的原因
export function resetPwd(data) {
    return function (dispatch) {
        dispatch(resetPwdSend(data));
        return post("/api/user/resetpassword", {
            mobile: data.mobile,
            pwd: data.pwd,
            code: data.smsCode
        })
    }
}
