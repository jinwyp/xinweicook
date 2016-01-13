import fetch, {post} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"
import {orderData} from "../utils/order"

export function toggleSelector(state) {
    return {
        type: types.TOGGLE_POSITION_SELECTOR,
        state
    }
}