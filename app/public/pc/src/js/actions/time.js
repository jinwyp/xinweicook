import fetch, {post} from "../utils/xw-fetch"
import * as types from "../constants/ActionTypes"


export function selectTime(time, cookingType) {
    return {
        type: types.SELECT_TIME,
        time, cookingType
    }
}

function getTimeStart() {
    return {
        type: types.GET_TIME
    }
}

function getTimeDone(timeList, cookingType) {
    return {
        type: types.GET_TIME,
        status: 'success',
        timeList, cookingType
    }
}

function getTimeFailed(error) {
    return {
        type: types.GET_TIME,
        status: 'error',
        error
    }
}

/**
 * format date to {day: '2015-07-02', segment: '12:00'}
 * @param cookingType
 * @param address
 * @returns {Function}
 */
export function getTime(cookingType, address) {
    return function (dispatch) {
        dispatch(getTimeStart())
        var promise
        if (cookingType == 'ready to cook') {
            promise = post('/api/orders/delivery/time', {
                cookingType: 'ready to cook',
                isCityShanghai: address.city.indexOf('上海') != -1,
                isInRange4KM: address.isAvailableForEat
            }).then(res => {
                if (!res.length) return res
                var ret = []
                res.forEach(time => {
                    if (time.segment) {
                        time.segment.forEach(s => {
                            ret.push({
                                day: time.day,
                                segment: s.text
                            })
                        })
                    } else {
                        ret.push({day: time.day})
                    }
                })
                timeCache[cookingType + address._id] = ret
                return ret
            })
        } else {
            promise = post('/api/orders/delivery/time/eat/warehouse', {
                _id: address.warehouse
            }).then(res => {
                return timeCache[cookingType + address._id] = res.timeList.map(time => {
                    return {
                        day: time.hour.substr(0, 10),
                        segment: time.hour.substr(11, 5)
                    }
                })
            })
        }
        return promise.then(timeList => dispatch(getTimeDone(timeList, cookingType)))
    }
}

var timeCache = {}

export function getTimeIfNeeded() {
    return function (dispatch, getState) {
        var cookingTypes = {}
        getState().cart.filter(item => item.selected)
            .forEach(item => {cookingTypes[item.dish.cookingType] = true})
        cookingTypes = Object.keys(cookingTypes)
        if (!cookingTypes.length) return

        var addresses = getState().address.addresses.filter(item => item.selected)
        if (!addresses.length) return

        for (var i = 0; i < cookingTypes.length; i++) {
            var type = cookingTypes[i];
            for (var j = 0; j < addresses.length; j++) {
                var address = addresses[j]
                var key = type + address._id
                if (timeCache[key]) {
                    dispatch(getTimeDone(timeCache[key], type))
                } else {
                    dispatch(getTime(type, address))
                }
            }
        }
    }
}