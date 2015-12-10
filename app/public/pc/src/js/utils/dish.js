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
    return item.dish.stockWarehouse.some(w => w.warehouse == warehouse && w.stock > 0)
        && item.subDish && item.subDish.every(it => hasStock(it, warehouse))
}