import fetch from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"


function requestUser() {
    return {
        type: types.FETCH_USER
    }
}

/**
 * 本来是给接收user用的,但是因为shoppingCart也挂在这个上面,所以也用来给购物车用
 * @param user
 * @param warehouse 只与购物车有关, 但是也要传递, 真的..
 * @returns {{type: FETCH_USER, status: string, user: *}}
 */
function receiveUser(user, warehouse) {
    return {
        type: types.FETCH_USER,
        status: 'success',
        user,
        warehouse
    }
}

export function getUser() {
    return function (dispatch, getState) {
        dispatch(requestUser())
        return fetch('/api/user').then(res=>{
            dispatch(receiveUser(res, getState().warehouse))
        })
    }
}

export function getUserIfNeeded() {
    return function (dispatch, getState) {
        var user = getState().user //the user may be a promise
        return '_id' in user ? Promise.resolve(user) : dispatch(getUser())
    }
}
