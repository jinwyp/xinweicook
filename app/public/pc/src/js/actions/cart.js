import fetch, {post} from "../utils/xw-fetch"
import {toPostDish} from '../utils/dish'
import * as types from "../constants/ActionTypes"
import {getUserIfNeeded} from "./user"

// get user 即表示 get cart, 所以只能通过在cart中, case 'Fetch_USER'来对cart处理
export function getCart() {
    return function (dispatch) {
        return dispatch(getUserIfNeeded())
    }
}

function saveCartSuccess() {
    return {
        type: types.SAVE_CART,
        status: 'success'
    }
}

function saveCartStart() {
    return {
        type: types.SAVE_CART
    }
}

var timer = null;

function saveCart(dispatch, getState) {
    dispatch(saveCartStart());
    if (!timer) {
        timer = setTimeout(()=> {
            timer = null;
            post('/api/user/shoppingcart', {
                shoppingCart: getState().cart.map(toPostDish)
            }).then(()=>dispatch(saveCartSuccess()))
        }, 2000)
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

function _plusDish(id) {
    return {
        type: types.CART_PLUS_DISH,
        id
    }
}

function _minusDish(id) {
    return {
        type: types.CART_MINUS_DISH,
        id
    }
}

function _delDish(id) {
    return {
        type: types.CART_DEL_DISH,
        id
    }
}

export function plusDish(id) {
    return function (dispatch, getState) {
        dispatch(_plusDish(id))
        return saveCart(dispatch, getState)
    }
}
export function minusDish(id) {
    return function (dispatch, getState) {
        dispatch(_minusDish(id))
        return dispatch(saveCart(dispatch, getState))
    }
}
export function delDish(id) {
    return function (dispatch, getState) {
        dispatch(_delDish(id))
        return dispatch(saveCart(dispatch, getState))
    }
}