"use strict";

import {init as initCommon} from './common'
import {User, Dish} from '../models'
import $ from 'jquery'
import bindDish from '../utils/bind-dish-operation'

var dishes, cart, user

$(document).ready(() => {
    Promise.all([
        User.getUser(),
        Dish.getList()
    ]).then(res => {
        user = res[0]
        dishes = res[1]
        cart = user && user.shoppingCart || []
        initCommon(user)

        bindDish(cart, dishes, '.menus')
    })
})
