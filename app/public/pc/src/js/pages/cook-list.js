"use strict";

import {init as initCommon} from './common'
import {User, Dish} from '../models'
import $ from 'jquery'
import bindDish, {bindTab} from '../utils/bind-dish-operation'
import '../utils/jquery'
import {search} from '../utils/utils'

// init position selector(react)
import './position-selector'

var dishes, cart, user

$(document).ready(() => {
    // init img lazy load
    $('img[data-src]').imgLazyLoad()

    initSortAndFilter()

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

function initSortAndFilter() {
    // pay attentions to xss.
    var sortType = search().sort
    var tags = search().t
    var $sortList = $('.sort-items')
    var $filterList = $('.filter-items')
    if (tags) {
        tags = typeof tags == 'string' ? [tags] : tags
    }

    if (sortType) {
        $sortList.find(`[data-type="${sortType}"]`).addClass('act')
    }
    if (tags) {
        $filterList.find('li').each(function () {
            var $li = $(this)
            if (tags.indexOf($li.data('tag')) != -1) {
                $li.addClass('act')
            }
        })
    }
    // 如果某个分类没有一项被选中, 则选中全部
    $('.filters > li').each(function () {
        var $this = $(this)
        if (!$this.find('.act').length) {
            $this.find('li:not([data-tag])').addClass('act')
        }
    })

    //绑定事件
    $sortList.on('click', 'li', function () {
        $sortList.children().removeClass('act')
        $(this).addClass('act')
        var search = getSearchData()
        location.href = location.pathname + search ? `?${search}` : ''
    })

    $filterList.on('click', 'li', function () {
        var $this = $(this)
        $this.parent().children().removeClass('act')
        $this.addClass('act')
        var search = getSearchData()
        location.href = location.pathname + search ? `?${search}` : ''
    })


    // 菜单关闭弹出
    $('.sort-group, .filter-group').hover(function () {
        var $this = $(this)
        $this.find('h4').removeClass('down')
        $this.find('.sort-items, .filters').show()
    }, function () {
        var $this = $(this)
        $this.find('h4').addClass('down')
        $this.find('.sort-items, .filters').hide()
    })

    function getSearchData() {
        var sort = $sortList.find('.act').data('type')
        var tags = []
        var ret = []
        $filterList.find('[data-tag].act').each(function () {
            tags.push($(this).data('tag'))
        })
        if (sort) {
            ret.push(`sort=${sort}`)
        }
        if (tags.length) {
            tags.forEach(tag => {
                ret.push(`t=${tag}`)
            })
        }
        return ret.join('&')
    }

}
