import fetch from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"

export function selectCard(id, payPrice) {
    return {
        type: types.SELECT_COUPON_CARD,
        id, payPrice
    }
}

function getCouponCodeStart(code) {
    return {
        type: types.GET_COUPON_CODE,
        code
    }
}

function getCouponCodeDone(info) {
    return {
        type: types.GET_COUPON_CODE,
        status: 'success',
        info
    }
}

export function getCouponCode(code) {
    return function (dispatch) {
        dispatch(getCouponCodeStart(code))
        return fetch(`/api/coupons/code/${code}`).then(res => {
            return dispatch(getCouponCodeDone(res))
        })
    }
}
