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