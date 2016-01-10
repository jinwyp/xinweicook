export function orderData(state, isOrder) {
    var {cart, coupon, balance, address,
        freight, time, comment, warehouse} = state

    var cookingType = {}
    var dishList = []
    cart.forEach(item => {
        if (item.selected) {
            var dish = item.dish
            cookingType[dish.cookingType] = true
            dishList.push({
                dish: dish._id,
                number: item.number,
                subDish: !item.subDish ? [] : item.subDish.map(el => {
                    return {
                        dish: el.dish._id,
                        number: el.number
                    }
                })
            })
        }
    })
    cookingType = Object.keys(cookingType)
    cookingType = cookingType.length > 1 ? 'ready to cook' : cookingType[0]

    var selectedAddress = address.addresses.filter(el => el.selected)[0]
    var ret = {
        cookingType: cookingType,
        usedAccountBalance: balance.useBalance,
        addressId: selectedAddress._id,
        clientFrom: 'website',
        dishList: dishList
    }
    if (coupon.card.selectedCard) {
        ret.coupon = coupon.card.selectedCard._id
    }
    if (coupon.code.code) {
        ret.promotionCode = coupon.code.code
    }

    // 以上为生成订单和生成计算快递的公共部分的数据生成,以下为生成订单部分的数据.
    if (isOrder) {
        ret.payment = 'alipay direct'
        ret.userComment = comment
        ret.warehouseId = warehouse
        ret.freight = freight
        ret.credit = 0
        ret.paymentUsedCash = false

        if (time.eat.selectedTime) {
            ret.deliveryDateEat = time.eat.selectedTime.day
            ret.deliveryTimeEat = time.eat.selectedTime.segment
        }

        if (time.cook.selectedTime) {
            var segment = time.cook.selectedTime.segment
            ret.deliveryDateCook = time.cook.selectedTime.day
            ret.deliveryTimeCook = !segment ? '12:00'
                : segment.substr(6, 5) // see actions/time.js
        }
    }

    return ret
}