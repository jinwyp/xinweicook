import fetch, {post as _post, put as _put} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"

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
function getDone(addresses) {
    return {
        type: types.GET_ADDRESS,
        status: 'success',
        addresses
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
    return function (dispatch) {
        dispatch(getStart())
        fetch('/api/user/address')
            .then(addresses => dispatch(getDone(addresses)))
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
function delDone() {
    return {
        type: types.DEL_ADDRESS,
        status: 'success'
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
        fetch(`/api/user/address/${id}`)
        .then(addresses => dispatch(delDone()))
        .catch(err => dispatch(delFailed(err)))
    }
}

export function toggleStreet() {
    return {
        type: types.TOGGLE_STREET
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
        fetch(`/mobile/placesearch?query=${query}&region=${region}`).then(res => {
            return dispatch(getStreetDone(res.results))
        })
    }
}
