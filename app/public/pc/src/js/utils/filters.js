export function imgAdapt(url, width, height) {
    return `${url}?imageView2/1/w/${width || 640}/h/${height || 427}`
}

export function orderStatus(status) {
    if (!orderStatus.status) {
        orderStatus.status = {
            'not paid': '未支付',
            'paid': '已支付',
            'confirmed': '已确认',
            'dish finished': '已制作完成',
            'packaged': '已打包',
            shipped: '已发货',
            finished: '已完成',
            canceled: '已取消'
        }
    }
    return orderStatus.status[status] || ''
}