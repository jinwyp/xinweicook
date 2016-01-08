"use strict";

import {init as initCommon} from './common'
import {User, Dish} from '../models'
import $ from 'jquery'
import bindDish, {bindTab} from '../utils/bind-dish-operation'

var dishes, cart, user

$(document).ready(() => {
    Promise.all([
        User.getUser(),
        Dish.getList({cookingType: 'ready to cook'})
    ]).then(res => {
        user = res[0]
        dishes = res[1]
        cart = user && user.shoppingCart || []
        initCommon(user)

        bindDish(cart, dishes, '.product-info, .menus')
    })

    bindTab('.tabs > div', '.tabbtn', 'act')
})
