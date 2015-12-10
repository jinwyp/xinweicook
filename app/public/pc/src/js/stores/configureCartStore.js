import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { combineReducers } from 'redux'
import cart from '../reducers/cart'
import address from '../reducers/address'
import warehouse from '../reducers/warehouse'
import user from '../reducers/user'

var createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)

export default function () {
    return createStoreWithMiddleware(combineReducers({
        cart, address, warehouse, user
    }))
}
