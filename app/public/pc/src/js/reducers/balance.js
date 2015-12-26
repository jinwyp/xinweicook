import * as types from '../constants/ActionTypes'

function balance(state = {
    totalBalance: 0,
    useBalance: false
}, action) {
    switch (action.type) {
        case types.TOGGLE_BALANCE:
            // 如果需要支付的价格小于等于0,那么不要使用余额
            if (action.payPrice <= 0) {
                return state
            }

            return {
                ...state,
                useBalance: !state.useBalance
            }

        case types.GET_BALANCE:
            if (action.status == 'success') {
                return {
                    totalBalance: action.balance,
                    useBalance: false
                }
            }
            return state

        default: return state
    }
}

export default balance