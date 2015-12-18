import {post} from "../utils/xw-fetch"
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
