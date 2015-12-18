import * as types from '../constants/ActionTypes'

function order(state = {
    isSending: false,
    errInfo: ''
}, action) {
    switch (action.type) {
        case types.POST_ORDER:
            if (action.status == 'success')
                return {
                    isSending: false
                }
            else if (action.status == 'error')
                return {
                    isSending: false,
                    errInfo: action.error
                }
            else return {
                    isSending: true
                }

        default: return state
    }
}

export default order