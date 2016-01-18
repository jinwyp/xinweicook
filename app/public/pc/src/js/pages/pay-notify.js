"use strict";

import {init as initCommon} from './common'
import {User} from '../models'
import $ from 'jquery'
import {search} from '../utils/utils'

var cart, user

$(document).ready(() => {
    var status = search(location.search).trade_status
    if (status == 'TRADE_FINISHED' || status == 'TRADE_SUCCESS') {
        $('.success').show()
    } else if (status) {
        $('.failed').show()
    }

    Promise.all([
        User.getUser()
    ]).then(res => {
        user = res[0]
        initCommon(user)
    })
})