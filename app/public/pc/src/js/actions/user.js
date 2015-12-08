import fetch from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"


function requestUser() {
    return {
        type: types.REQUEST_USER
    }
}

function receiveUser(user) {
    return {
        type: types.RECEIVE_USER,
        user
    }
}

export function getUser() {
    return function (dispatch) {
        dispatch(requestUser())
        return fetch('/api/user').then(res=>{
            dispatch(receiveUser(res))
        })
    }
}

export function getUserIfNeeded() {
    return function (dispatch, getState) {
        var user = getState().user //the user may be a promise
        return user ? Promise.resolve(user) : getUser()
    }
}

