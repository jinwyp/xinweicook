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

var CJDishId = '55b1b46e4c2900bb159cafc2' //'56988143247c25ce3fa59a01'
var QRJDishId = '562f3279a615556a44128dca' //'56a4dc2097fdeb3361dcc7b1'

function getTimeDone(timeList, cookingType, cart, address) {
    if (cookingType == 'ready to cook') {
        var hasCJ, hasQRJ, selectedAddress, isInRange4KM
        cart.filter(el => el.dish.cookingType == 'ready to cook' && el.selected)
            .forEach(el => {
                if (el.dish._id == CJDishId)
                    hasCJ = true
                if (el.dish._id == QRJDishId)
                    hasQRJ = true
            })
        if (hasCJ || hasQRJ) {
            selectedAddress = address.addresses.filter(el => el.selected)[0]
            isInRange4KM = selectedAddress.warehouse == '56332187594b09af6e6c7dd2'
            if (hasCJ) {
                timeList = [
                    {
                        "day":"2016-02-06",
                        "segment":[
                            {"name":"10","text":"10:00-20:00","status":true}
                        ]
                    }
                ]
            }

            if (hasQRJ) {
                if (isInRange4KM) {
                    timeList = [
                        {
                            "day":"2016-02-13",
                            "segment":[
                                {"name":"10","text":"10:00-20:00","status":true}
                            ]
                        },
                        {
                            "day":"2016-02-14",
                            "segment":[
                                {"name":"10","text":"10:00-20:00","status":true}
                            ]
                        }
                    ]
                } else timeList = [
                    {
                        "day":"2016-02-14",
                        "segment":[
                            {"name":"10","text":"10:00-20:00","status":true}
                        ]
                    }
                ]
            }

            var ret = []
            timeList.forEach(time => {
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
            timeList = ret

        }
    }

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
    return function (dispatch, getState) {
        dispatch(getTimeStart())
        var promise
        if (cookingType == 'ready to cook') {
            promise = post('/api/orders/delivery/time', {
                cookingType: 'ready to cook',
                isCityShanghai: address.city.indexOf('上海') != -1,
                isInRange4KM: address.warehouse == '56332187594b09af6e6c7dd2'
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
        return promise.then(timeList => dispatch(getTimeDone(timeList, cookingType, getState().cart, getState().address)))
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
                    dispatch(getTimeDone(timeCache[key], type, getState().cart, getState().address))
                } else {
                    dispatch(getTime(type, address))
                }
            }
        }
    }
}