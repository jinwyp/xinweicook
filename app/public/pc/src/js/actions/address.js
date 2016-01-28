import fetch, {post as _post, put as _put, del as _del} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"
import {allIsEatInCart} from '../utils/dish'

export function select(id, address) {
    return {
        type: types.SELECT_ADDRESS,
        id, address
    }
}

export function editAddress(id) {
    return {
        type: types.EDIT_ADDRESS,
        id
    }
}

export function closeEditAddress() {
    return {
        type: types.CLOSE_EDIT_ADDRESS
    }
}


function getStart() {
    return {
        type: types.GET_ADDRESS
    }
}
/**
 * @param addresses
 * @param allIsEat - 表示购物车中的所有dish都是便当(那样显示地址的时候就可以直接显示不可送达)
 * @returns {{type: GET_ADDRESS, status: string, addresses: *, cart: *}}
 */
function getDone(addresses, allIsEat) {
    return {
        type: types.GET_ADDRESS,
        status: 'success',
        addresses, allIsEat
    }
}
function getFailed(error) {
    return {
        type: types.GET_ADDRESS,
        status: 'error',
        error
    }
}
export function getList() {
    return function (dispatch, getState) {
        dispatch(getStart())
        return fetch('/api/user/address')
            .then(addresses => {
                return dispatch(getDone(addresses, allIsEatInCart(getState().cart)))
            })
            .catch(err => dispatch(getFailed(err)))
    }
}


function postStart() {
    return {
        type: types.POST_ADDRESS
    }
}
function postDone(address) {
    return {
        type: types.POST_ADDRESS,
        status: 'success',
        address
    }
}
function postFailed(error) {
    return {
        type: types.POST_ADDRESS,
        status: 'error',
        error
    }
}
export function postOne(address) {
    return function (dispatch) {
        dispatch(postStart())
        // 保存的那个地址总是默认地址
        address.isDefault = true
        return _post('/api/user/address', address)
        .then(addr => {
                dispatch(postDone(addr))
                dispatch(closeEditAddress())
            })
        .catch(err => dispatch(postFailed(err)))
    }
}


function putStart() {
    return {
        type: types.PUT_ADDRESS
    }
}
function putDone(address) {
    return {
        type: types.PUT_ADDRESS,
        status: 'success',
        address
    }
}
function putFailed(error) {
    return {
        type: types.PUT_ADDRESS,
        status: 'error',
        error
    }
}
export function putOne(address) {
    return function (dispatch) {
        dispatch(putStart())
        address.isDefault = true
        return _put(`/api/user/address/${address._id}`, address)
            .then(addr => {
                dispatch(putDone(addr))
                dispatch(closeEditAddress())
            })
            .catch(err => dispatch(putFailed(err)))
    }
}


function delStart() {
    return {
        type: types.DEL_ADDRESS
    }
}
function delDone(id) {
    return {
        type: types.DEL_ADDRESS,
        status: 'success',
        id
    }
}
function delFailed(error) {
    return {
        type: types.DEL_ADDRESS,
        status: 'error',
        error
    }
}
export function delOne(id) {
    return function (dispatch) {
        dispatch(delStart())
        _del(`/api/user/address/${id}`)
        .then(addresses => dispatch(delDone(id)))
        .catch(err => dispatch(delFailed(err)))
    }
}


// street
export function toggleStreet(show) {
    return {
        type: types.TOGGLE_STREET,
        show: show
    }
}


function getStreetStart() {
    return {
        type: types.GET_STREET
    }
}

function getStreetDone(streets) {
    return {
        type: types.GET_STREET,
        status: 'success',
        streets
    }
}

export function getStreet(query, region) {
    return function (dispatch) {
        dispatch(getStreetStart())
        _post('/api/user/address/suggestion', {query, region}).then(res => {
            return dispatch(getStreetDone(res))
        })
    }
}

export function clearStreet() {
    return {
        type: types.CLEAR_STREET
    }
}


function getRangeStart() {
    return {
        type: types.GET_RANGE
    }
}

function getRangeDone(range) {
    return {
        type: types.GET_RANGE,
        status: 'success',
        range
    }
}

export function getRange() {
    return function (dispatch) {
        dispatch(getRangeStart())
        fetch('/api/orders/delivery/range').then(res => {
            dispatch(getRangeDone(res))
        })
    }
}

export function getRangeIfNeeded() {
    return function (dispatch, getState) {
        var range = getState().address.range
        if (range.length) return
        dispatch(getRange())
    }
}