import * as types from '../constants/ActionTypes'

function freight(state = 0, action) {
    switch (action.type) {
        case types.GET_FREIGHT:
            if (action.status == 'success') {
                return action.freight
            }
            return state

        default: return state
    }
}

export default freight