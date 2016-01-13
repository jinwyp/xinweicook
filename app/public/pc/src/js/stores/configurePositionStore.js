import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { combineReducers } from 'redux'

import address from '../reducers/address'
import positionSelector from '../reducers/position-selector.js'

var createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)

export default function () {
    return createStoreWithMiddleware(combineReducers({
        address, positionSelector
    }))
}
