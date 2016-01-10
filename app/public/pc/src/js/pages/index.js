"use strict";

import {init as initCommon} from './common'
import {User, Dish, Address} from '../models'
import $ from 'jquery'
import bindDish from '../utils/bind-dish-operation'


var dishes, cart, user, range

$(document).ready(() => {
    Promise.all([
        User.getUser(),
        Dish.getList(),
        Address.range()
    ]).then(res => {
        user = res[0]
        dishes = res[1]
        range = res[2]
        cart = user && user.shoppingCart || []
        initCommon(user)

        bindDish(cart, dishes, '.menus')
    })
})
