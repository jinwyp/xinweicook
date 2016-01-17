import {__} from './locale'

export function imgAdapt(url, width, height) {
    return `${url}?imageView2/1/w/${width || 640}/h/${height || 427}`
}

export function orderStatus(status) {
    if (!orderStatus.status) {
        orderStatus.status = {
            'not paid': __('Not Paid'),
            'paid': __('Paid'),
            'confirmed': __('Confirmed'),
            'dish finished': __('Dish Finished'),
            'packaged': __('Packaged'),
            shipped: __('Shipped'),
            finished: __('Finished'),
            canceled: __('Canceled')
        }
    }
    return orderStatus.status[status] || ''
}

export function postDish(dish) {
    return {
        dish: dish.dish._id,
        number: dish.number,
        subDish: !dish.subDish ? [] : dish.subDish.map(function (el) {
            return {
                dish: el.dish._id,
                number: el.number
            }
        })
    }
}