"use strict";

import "../../sass/style.scss"
import 'babel-polyfill'

// including react into webpack-common
import React from "react"
import {init as initHeader, place} from './header'

import ee from 'event-emitter'

export function init(user) {
    initHeader(user)
    if (localStorage.defaultAddress) {
        place(localStorage.defaultAddress)
    }
}

/**
 * events: {
 *  positionChanged: {
 *      prevAddress: {}
 *      oldAddress: {}
 *  },
 *  noAddressAlert: none
 * }
 */
export var emitter = ee({})
emitter.t = {
    positionChanged: 'positionChanged',
    noAddressAlert: 'noAddressAlert'
}