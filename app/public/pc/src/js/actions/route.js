import * as types from '../constants/ActionTypes'

export function changeRoute(route) {
    return {
        type: types.CHANGE_ROUTE,
        route
    }
}