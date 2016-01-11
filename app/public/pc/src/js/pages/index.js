"use strict";

import {init as initCommon} from './common'
import {User, Dish, Address} from '../models'
import $ from 'jquery'
import '../utils/jquery-utils'
import bindDish from '../utils/bind-dish-operation'
import handlebars from 'handlebars/dist/handlebars'
import * as tpl from '../dom/templates'
import Modal from '../dom/modal'
import * as header from './header'
import {post} from '../utils/xw-fetch'


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


        if (localStorage.province) {
            if (localStorage.province != '上海' || localStorage.defaultAddress) {
                return
            }
        }

        // bind address selection
        var modal = new Modal(addressSelectionsTpl({
            province: range.map( el => el.state)
        }))
        modal.on('change', '#province', function () {
            var $root = $(this).closest('.address-selection')
            var $address = $root.find('form > .address')
            if (this.value == '上海') {
                $address.show().find('.street-list').hide()
                localStorage.province = this.value
            } else {
                localStorage.province = this.value
                $address.hide()
                modal.close()
                modal.destroy()
            }
        })
        var timer = null
        modal.on('keydown', '#address', function () {
            if (this.value < 2) return
            var $root = $(this).closest('.address')
            var $streetList = $root.find('.street-list')
            clearTimeout(timer)
            timer = setTimeout(() => {
                Address.suggestion(this.value).then(res => {
                    if (res.length) {
                        $streetList.show().html(res.map(street => streetItemTpl(street)))
                    }
                })
            }, 500)
        })

        modal.on('click', '.street-list li', function () {
            var $root = $(this)
            var address = $root.find('.name').html()
            var lat = Number($root.data('lat'))
            var lng = Number($root.data('lng'))
            // todo. to render place in the header
            localStorage.defaultAddress = address
            localStorage.defaultLat = lat
            localStorage.defaultLng = lng
            modal.close()
            header.place(address)
            modal.destroy()
        })
        modal.open()
    })
})

var addressSelectionsTpl = handlebars.compile(tpl.addressSelection)
var streetItemTpl = handlebars.compile(tpl.streetItem)