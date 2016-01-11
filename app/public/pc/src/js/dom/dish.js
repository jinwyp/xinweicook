"use strict";

import $ from 'jquery'

/**
 * 对那些需要加减操作的dish DOMs 进行事件绑定
 * @param parent
 * @param selectors {object} - {plus[, minus]}
 * @param plusHandler {Function} - (event, dishId)=>{
 *    有多属性选择时,弹出多属性选择窗口
 *    没有时,直接 +1 ,然后调用render方法
 * }
 * @param minusHandler {Function} - (event, dishId)=>{
 *    只在无多属性选择时,才使用. -1, render
 * }
 */
export function bind(parent, selectors, plusHandler, minusHandler) {
    var $parent = $(parent)

    $parent.on('click', selectors.plus, function (event) {
        var id = $(event.target).closest('[data-id]').data('id')
        if (!id) return
        plusHandler(event, id)
    })

    minusHandler && selectors.minus && $(parent).on('click', selectors.minus, function (event) {
        var id = $(event.target).closest('[data-id]').data('id')
        if (!id) return
        minusHandler(event, id)
    })
}

/**
 * 根据dish的id,来改变对应counter的数值显示,以及减号的显示
 * @param id
 * @param number
 * @param showMinus - 是否显示minus button
 * @param counterSelector
 * @param minusSelector - minus按钮的选择器
 */
export function render(id, number, showMinus, counterSelector='.plusok', minusSelector='.mius') {
    var $parent = $(`[data-id="${id}"]`)
    var $counter = $parent.find(counterSelector).html(number)
    if (number == 0) {
        $counter.removeClass('show')
        $parent.find(minusSelector).hide()
    }
    if (number >= 1 && !$counter.hasClass('show')) {
        $counter.addClass('show')
    }
    if (showMinus && number > 0) {
        $parent.find(minusSelector).show()
    }
}
