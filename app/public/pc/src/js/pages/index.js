"use strict";

import {init as initCommon, emitter} from './common'

import $ from 'jquery'
import handlebars from 'handlebars/dist/handlebars'
import '../utils/jquery-utils'

import {User, Dish, Address} from '../models'

import bindDish from '../utils/bind-dish-operation'
import {post} from '../utils/xw-fetch'
import * as tpl from '../dom/templates'
import Modal from '../dom/modal'
import * as header from './header'
// init position selector(react)
import './position-selector'


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

        // init others comments
        $('.magazine li').fadeList()
        $('.banner li').fadeList()

        // bind video
        var $play = $('.videolink .play')
        var $video = $('.videolink video')
        $play.on('click', function () {
            $play.hide().addClass('playing')
            $video.show()[0].play()
        })
        $video.on('click', function () {
            $video[0].pause()
            $play.show()
        })
    })
})

var addressSelectionsTpl = handlebars.compile(tpl.addressSelection)
var streetItemTpl = handlebars.compile(tpl.streetItem)