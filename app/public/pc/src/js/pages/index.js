"use strict";

import {init as initCommon, emitter} from './common'

import $ from 'jquery'
import '../utils/jquery'

import {User, Dish} from '../models'

import bindDish from '../utils/bind-dish-operation'
import {post} from '../utils/xw-fetch'
// init position selector(react)
import './position-selector'


var dishes, cart, user, range

import {__} from '../utils/locale'

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

        // init others comments
        $('.magazine li').fadeList({fadeTime: 500})
        $('.banner li').fadeList({fadeTime: 500})

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

    var $header = $('header')
    var normalHeader = $header.hasClass('normal')
    $(window).on('scroll', function () {
        if ((window.scrollY || document.documentElement.scrollTop) > 112) {
            if (!normalHeader) {
                $header.addClass('normal')
                normalHeader = true
            }
        } else if (normalHeader){
            normalHeader = false
            $header.removeClass('normal')
        }
    })
})