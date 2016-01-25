import fetch, {post} from "../utils/xw-fetch"
import {toPostDish, availableWarehouse} from '../utils/dish'
import * as types from "../constants/ActionTypes"
import {getUserIfNeeded} from "./user"
import {allIsEatInCart} from '../utils/dish'

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
            return post('/api/user/shoppingcart', {
                shoppingCart: getState().cart.map(toPostDish)
            }).then(()=>dispatch(saveCartSuccess()))
        }, 2000)
    }
}

function selectionChanged(info) {
    return {
        type: types.CART_SELECTION_CHANGED,
        info
    }
}

export function selectOne(id, select) {
    return function (dispatch, getState) {
        dispatch(_selectOne(id, select))
        return dispatch(selectionChanged(getCookingTypeAndWarehouse(getState().cart)))
    }
}

function _selectOne(id, select) {
    return {
        type: types.CART_SELECT_ONE,
        id, select
    }
}

export function selectAll(cookingType) {
    return function (dispatch, getState) {
        dispatch(_selectAll(cookingType))
        return dispatch(selectionChanged(getCookingTypeAndWarehouse(getState().cart)))
    }
}

function _selectAll(cookingType, info) {
    return {
        type: types.CART_SELECT_ALL,
        cookingType, info
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

function _delDish(id, info) {
    return {
        type: types.CART_DEL_DISH,
        id, info
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
        return saveCart(dispatch, getState)
    }
}
export function delDish(id) {
    return function (dispatch, getState) {
        var cart = getState().cart
        var isChanged = cart.some(item => item._id == id);
        dispatch(_delDish(id))
        isChanged && dispatch(selectionChanged(getCookingTypeAndWarehouse(cart)))
        return saveCart(dispatch, getState)
    }
}

/**
 * 从购物车中提取cookingType信息,以及warehouse信息
 * @param dishList
 * @returns {{}} - {
 *  'ready to cook': true,
 *  ['ready to eat': true,]
 *  warehouse: {abcdefghijklmn: true, ..},
 *  allIsEat: false
 *  }
 */
function getCookingTypeAndWarehouse(dishList) {
    var ret = {}
    var selectedCart = dishList.filter(item => item.selected)
    selectedCart.forEach(item => ret[item.dish.cookingType] = true)

    // 下面只过滤出便当的可配送库存
    ret.warehouse = availableWarehouse(
        selectedCart.filter(item => item.dish.cookingType == 'ready to eat'))

    ret.allIsEat = allIsEatInCart(dishList)

    return ret
}
