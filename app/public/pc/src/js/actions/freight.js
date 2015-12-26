import {post} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"
import {orderData} from "../utils/order"

function getFreightStart() {
    return {
        type: types.GET_FREIGHT
    }
}

function getFreightDone(freight) {
    return {
        type: types.GET_FREIGHT,
        status: 'success',
        freight
    }
}

export function getFreight() {
    return function (dispatch, getState) {
        getFreightStart()
        post('/api/orderprice', orderData(getState())).then(res => {
            dispatch(getFreightDone(res.freight))
        })
    }
}
