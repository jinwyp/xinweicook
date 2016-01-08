"use strict";

import "../../sass/style.scss"
import 'babel-polyfill'

import {init as initHeader} from './header'

export function init(user) {
    initHeader(user)
}