import * as types from '../constants/ActionTypes'

function comment(state = '', action) {
    switch (action.type) {
        case types.CHANGE_COMMENT:
            return action.text
        default: return state
    }
}

export default comment