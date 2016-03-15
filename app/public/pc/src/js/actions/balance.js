import fetch, {post} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"

export function toggleBalance(payPrice) {
    return {
        type: types.TOGGLE_BALANCE,
        payPrice
    }
}

function getBalanceStart() {
    return {
        type: types.GET_BALANCE
    }
}

function getBalanceDone(balance) {
    return {
        type: types.GET_BALANCE,
        status: 'success',
        balance
    }
}

export function getBalance() {
    return function (dispatch) {
        dispatch(getBalanceStart())
        return fetch('/api/user/account').then(res =>
            dispatch(getBalanceDone(res.balance)))
    }
}

function chargeBalanceDone(res) {
    return {
        type: types.CHARGE_BALANCE,
        status: 'success',
        alipayUrl: res.alipaySign.fullurl
    }
}

export function chargeBalance(price) {
    return function (dispatch) {
        return post('/api/user/account/details', {
            addAmount: price,
            payment: 'alipay direct',
            device_info: 'WEB'
        })
    }
}