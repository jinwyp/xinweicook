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
    $('.shopnow .buy').click(function (e) {
        if($(this).hasClass('disabled')) {
            e.preventDefault()
        }
    })
    Promise.all([
        User.getUser(),
        Dish.getList({cookingType: 'ready to eat'})
    ]).then(res => {
        user = res[0]
        dishes = res[1]
        cart = user && user.shoppingCart || []
        initCommon(user)

        bindDish(cart, dishes, '.eatlist, .menus')
    }).catch(e => {console.log(e)})
})
