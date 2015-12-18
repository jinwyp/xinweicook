import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { combineReducers } from 'redux'

import cart from '../reducers/cart'
import address from '../reducers/address'
import warehouse from '../reducers/warehouse'
import time from '../reducers/time'
import user from '../reducers/user'
import coupon from '../reducers/coupon'
import balance from '../reducers/balance'
import freight from '../reducers/freight'
import comment from '../reducers/comment'
import order from '../reducers/order'


var createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)

export default function () {
    return createStoreWithMiddleware(combineReducers({
        cart, address, warehouse, user, time, coupon, balance, freight, comment
    }))
}
