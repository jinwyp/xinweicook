"use strict";

import "../../sass/style.scss"
import 'babel-polyfill'

import {init as initHeader, place} from './header'

export function init(user) {
    initHeader(user)
    if (localStorage.defaultAddress) {
        place(localStorage.defaultAddress)
    }
}