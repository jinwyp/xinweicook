import fetch, from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"
import {getUserIfNeeded} from "./user"

// get user 即表示 get cart
export function getCart() {
    return function (dispatch) {
        dispatch(getUserIfNeeded())
    }
}

export function saveCart() {
    return function (dispatch) {

    }
}

export function selectOne(id) {
    return {
        type: types.CART_SELECT_ONE,
        id
    }
}

export function selectAll(cookingType) {
    return {
        type: types.CART_SELECT_ALL,
        cookingType
    }
}

export function plusDish(id) {
    return {
        type: types.CART_PLUS_DISH,
        id
    }
}

export function minusDish(id) {
    return {
        type: types.CART_MINUS_DISH,
        id
    }
}

export function delDish(id) {
    return {
        type: types.CART_DEL_DISH,
        id
    }
}