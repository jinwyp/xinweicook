export function toPostDish(item) {
    return {
        dish: item.dish._id,
        number: item.number,
        subDish: item.subDish.map( it=>{
            return {
                dish: it.dish._id,
                number: it.number
            }
        })
    }
}

export function hasStock(item, warehouse) {
    if (item.dish.cookingType == 'ready to cook') {
        return item.dish.stockWarehouse.some(el => el.stock > 0)
    }
    return item.dish.stockWarehouse.some(w => (!warehouse || w.warehouse == warehouse) && w.stock > 0)
        && item.subDish && item.subDish.every(it => hasStock(it, warehouse))
}

export function availableWarehouse(cartList) {
    var warehouses= {}
    cartList.forEach(item =>{
        var dish = item.dish
        dish.stockWarehouse.forEach(el => {
            var w = el.warehouse
            if (!(w in warehouses))
                warehouses[w] = true
            warehouses[w] = warehouses[w] && el.stock > 0
        })
    })
    return warehouses
}

export function price(item) {
    return item.number * (item.dish.priceOriginal + (!item.subDish ? 0 :
        item.subDish.reduce((p, el) => p + el.dish.priceOriginal, 0)))
}

export function hasMultipleSelections(dish) {
    var count = 0
    if (dish.preferences.length) {
        var preferences = dish.preferences
        for (var i = 0; i < preferences.length; i++) {
            count += preferences[i].foodMaterial.length
        }
    }
    return count > 1
}

export function isSameItemInCart(item1, item2) {
    return item1.dish._id == item2.dish._id && //主dish是否相同
        item1.subDish.every(function (a) { //子dish是否全部相同
            return item2.subDish.some(function (b) {
                return a.dish._id == b.dish._id
            })
        }) && item1.subDish.length == item2.subDish.length;
}

/**
 * 添加菜品到购物车, 如果有多属性则不能直接添加, 通过返回undefined来表示
 * @param dish
 * @param cart
 * @returns {number} - 如果 > 0 则表示直接添加, 否则表示有多属性, 不能直接添加.
 */
export function plusDish(dish, cart) {
    var cartItem
    if (!hasMultipleSelections(dish)) {
        // 如果没有,则直接操作
        var number
        cart.some(function (el) {
            if (el.dish._id == dish.id) {
                cartItem = el
                return true
            }
        })

        if (cartItem) { // 已经加入到购物车里边
            number = cartItem.number++
        } else {
            number = 1
            cart.unshift({
                dish: dish,
                number: number,
                subDish: []
            })
        }
        return number
    }
}

/**
 * 从购物车中,减去商品.多属性目前不能减(只能在购物车中减),无需考虑.因为没有多属性,只根据dish id即可找到相应item
 * @param dish - 这个倒是只用id就可以
 * @param cart
 * @returns {number}
 */
export function minusDish(dish, cart) {
    var number
    cart.some((el, i) => {
        if (el.dish._id == dish.id) {
            number = --el.number
            if (number == 0) {
                cart.splice(i, 1)
            }
            return true
        }
    })
    return number
}

/**
 * 通过id来获取数组中的dish.虽易,而用处极多,以其烦而提之.
 * @param dishes
 * @param id
 * @returns {*}
 */
export function getDish(dishes, id) {
    var dish
    dishes.some(el => {
        if (el._id == id) {
            dish = el
            return true
        }
    })
    return dish
}