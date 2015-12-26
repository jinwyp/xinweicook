import fetch, {post} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"
import {orderData} from "../utils/order"

function postOrderStart() {
    return {
        type: types.POST_ORDER
    }
}

function postOrderDone(data) {
    return {
        type: types.POST_ORDER,
        status: 'success',
        data
    }
}

function postOrderError(error) {
    return {
        type: types.POST_ORDER,
        status: 'error',
        error
    }
}

export function postOrder() {
    return function (dispatch, getState) {
        postOrderStart()
        post('/api/orders', orderData(getState(), true)).then(res => {
            dispatch(postOrderDone(res))
            setTimeout(() => {
                location.href = res.aliPaySign.fullurl
            })
        }).catch(res => dispatch(postOrderError(res)))
    }
}


function getOrdersStart() {
    return {
        type: types.GET_ORDERS
    }
}

function getOrdersDone(orders) {
    return {
        type: types.GET_ORDERS,
        status: 'success',
        orders
    }
}

export function getOrders(skip = 0, limit = 100) {
    return function (dispatch) {
        dispatch(getOrdersStart())
        return fetch(`/api/orders?skip=${skip}&limit=${limit}`).then(orders => {
            return dispatch(getOrdersDone(orders))
        })
    }
}
