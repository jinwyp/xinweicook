import fetch, {post, put} from "../utils/xw-fetch"
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

export function postOrder(justBalance) {
    return function (dispatch, getState) {
        dispatch(postOrderStart())
        post('/api/orders', orderData(getState(), true)).then(res => {
            dispatch(postOrderDone(res))
            if (justBalance) {
                alert('支付成功!');
                setTimeout(() => {
                    location.href = __PCPREFIX__ + '/me'
                })
            } else {
                setTimeout(() => {
                    location.href = res.aliPaySign.fullurl
                })
            }
        }).catch(res => dispatch(postOrderError(res)))
    }
}

// 取消订单
function cancelStart(id) {
    return {
        type: types.CANCEL_ORDER,
        id
    }
}

function cancelDone(order) {
    return {
        type: types.CANCEL_ORDER,
        status: 'success',
        order
    }
}

export function cancel(id) {
    return function (dispatch) {
        dispatch(cancelStart(id))
        return put(`/api/orders/${id}`, {
            isPaymentPaid: "false",
            status: "canceled"
        }).then(order => {
            dispatch(cancelDone(order))
        })
    }
}

// 支付订单
function payStart(id) {
    return {
        type: types.PAY_ORDER,
        id
    }
}

function payDone(id) {
    return {
        type: types.PAY_ORDER,
        status: 'success',
        id
    }
}

function payError(id) {
    return {
        type: types.PAY_ORDER,
        status: 'error',
        id
    }
}

export function payByAlipay(id) {
    return function (dispatch) {
        dispatch(payStart(id))
        return post('/api/orders/payment/alipay/sign', {
            _id: id
        }).then(res => {
            location.href = res.fullurl
        }).catch(res => {
            payError(id)
            // todo, remove
            console.warn('payError', res)
        })
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
