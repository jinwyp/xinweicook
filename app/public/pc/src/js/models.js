// 这里的东西不是给react的.
"use strict";

import fetch, {post, put} from './utils/xw-fetch'
import {toPostDish} from './utils/dish'
import {flyDish} from './dom/dish'

export var Dish = {
    getList: function (options) {
        options = options || {}
        return fetch(`/api/dishes?cookingType=${options.cookingType||''}` +
            `&skip=${options.skip||''}&limit=${options.limit||''}`)
    },
    getOne: function (id) {
        return fetch(`/api/dishes/${id}`)
    },
    like: function (id) {
        return put(`/api/dishes/${id}/like`)
    }
}

// 如何react的部分信息和非react公用呢
var timer = null
export var User = {
    getUser: function () {
        return fetch('/api/user').catch(() => null)
    },
    logout: function () {
        return post('/api/user/logout', {
            token_type_hint: "access_token",
            token: localStorage.access_token
        }).catch(() => {}).then(() => {
            delete localStorage.access_token
            delete localStorage['ngStorage-access_token']
        })
    },
    postCart: function (cart, id) {
        return post('/api/user/shoppingcart', {
            shoppingCart: cart
                .filter(item => !!item.dish)
                .map(toPostDish)
        }).then(() => {
            flyDish(id)
        })
    },
    postCartRelax: function (cart, id) {
        if (!timer) {
            timer = setTimeout(()=> {
                timer = null;
                return User.postCart(cart, id)
            }, 200) // todo: 如果时间太长了,会导致触发请求返回的时间过长,如果想早点知道403就有些悲催
        }
    }
}

var selectedAddressId
export var Address = {
    range: function () {
        return fetch('/api/orders/delivery/range')
    },
    suggestion: function (query, region='上海') {
        return post('/api/user/address/suggestion', {query, region})
    },
    isLoaded() {
        return !!selectedAddressId
    },
    noDefault() {
        return selectedAddressId == Address.constant.LOADED_NO_DEFAULT
    },
    setSelectedAddress(str) {
        selectedAddressId = str
    },
    constant: {
        LOADED_NO_DEFAULT: 'LOADED_NO_DEFAULT'
    }
}
