import fetch from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"


function signInSend() {
    return {
        type: types.SIGNIN_SEND
    }
}

function signInReceive(json) {
    return {
        type: types.SIGNIN_RECEIVE,
        success: json.data // todo:
    }
}

function signIn() {
    return function (dispatch) {
        dispatch(signInSend());
        return fetch("/api/user/token", {method: 'post'})
    }
}