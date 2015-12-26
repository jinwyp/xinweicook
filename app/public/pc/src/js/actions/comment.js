import * as types from "../constants/ActionTypes"

export function changeComment(text) {
    return {
        type: types.CHANGE_COMMENT,
        text
    }
}