import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { combineReducers } from 'redux'

import address from '../reducers/address'
import user from '../reducers/user'
import coupon from '../reducers/coupon'
import balance from '../reducers/balance'
import order from '../reducers/order'
import route from '../reducers/route'

var createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)

export default function () {
    return createStoreWithMiddleware(combineReducers({
        order, address, user, coupon, balance, route
    }))
}
