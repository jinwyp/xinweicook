"use strict";

import "../../sass/style.scss"
import 'babel-polyfill'

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
 *  }
 * }
 */
export var emitter = ee({})
emitter.t = {
    positionChanged: 'positionChanged'
}