import * as types from "../constants/ActionTypes"

export function toggleSelector(state) {
    return {
        type: types.TOGGLE_POSITION_SELECTOR,
        state
    }
}