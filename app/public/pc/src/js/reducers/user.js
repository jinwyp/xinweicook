import * as types from '../constants/ActionTypes'

export default function user(state = {}, action) {
    switch (action.type) {
        case types.FETCH_USER:
            return action.status == 'success' ? action.user : state

        default: return state
    }
}
