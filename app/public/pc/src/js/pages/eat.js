"use strict";

import {init as initCommon} from './common'
import {User, Dish} from '../models'
import $ from 'jquery'
import '../utils/jquery'
import bindDish from '../utils/bind-dish-operation'
// init position selector(react)
import './position-selector'

var dishes, cart, user

$(document).ready(() => {
    Promise.all([
        User.getUser(),
        Dish.getOne($('.product-info').data('id'))
    ]).then(res => {
        user = res[0]
        dishes = [res[1]]
        cart = user && user.shoppingCart || []
        initCommon(user)

        bindDish(cart, dishes, '.product-info')
    })
})