import * as types from '../constants/ActionTypes'

function route(state = window.location.hash.substr(1) || 'orders', action) {
    switch (action.type) {
        case types.CHANGE_ROUTE:
            return action.route

        default: return state
    }
}

export default route