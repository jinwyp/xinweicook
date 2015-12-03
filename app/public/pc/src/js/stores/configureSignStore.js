import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import signReducer from '../reducers/sign'

var createStoreWithMiddleware = applyMiddleware(
    thunkMiddleware
)(createStore)

export default function () {
    return createStoreWithMiddleware(signReducer)
}
