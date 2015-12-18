import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'


function card(state = {
    cardList: [],
    selectedCard: null
}, action) {
    switch (action.type) {
        case types.SELECT_COUPON_CARD:
            return {
                ...state,
                selectedCard: action.id ? state.cardList.filter(
                        card =>card._id == action.id)[0] : null
            }
        case types.FETCH_USER:
            if (action.status == 'success') {
                return {
                    cardList: action.user.couponList.filter(card => !card.isUsed)
                }
            }
            return state
        default: return state
    }
}

function code(state = {
    code: '',
    price: 0,
    errInfo: ''
}, action) {
    switch (action.type) {
        case types.GET_COUPON_CODE:
            if (action.status == 'success') {
                var now = Date.now()
                var begin = new Date(action.info.startDate)
                var end = new Date(action.info.endDate)
                if (now >= begin && now < end)
                    return {
                        code: action.info.code,
                        price: action.info.price
                    }
                else return {
                    ...state, errInfo: '优惠码不在使用期限内'
                }
            }
            return state

        default: return state
    }
}

var couponReducer = combineReducers({card, code})

export default couponReducer