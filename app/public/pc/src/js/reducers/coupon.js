import * as types from '../constants/ActionTypes'
import { combineReducers } from 'redux'


function card(state = {
    cardList: [],
    selectedCard: null
}, action) {
    switch (action.type) {


        default: return state
    }
}

function code(state = {
    code: '',
    price: 0
}, action) {

}

var couponReducer = combineReducers({card, code})

export default couponReducer