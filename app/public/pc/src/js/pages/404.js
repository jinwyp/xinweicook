"use strict";

import {init as initCommon} from './common'
import {User} from '../models'
import $ from 'jquery'

var cart, user

$(document).ready(() => {
    Promise.all([
        User.getUser()
    ]).then(res => {
        user = res[0]
        initCommon(user)
    })
})