import $ from 'jquery'

var modalTpl = `
<div class="xw-modal">
    <div class="overlay"></div>
    <div class="wrapper"></div>
</div>
`
/**
 * 只是拥有结构,并会插入到body最后的modal,并不含样式
 */
export default class Modal {
    /**
     * 根据内容来生成一个modal,
     * @param content - 作为modal中到窗口html
     * @param id - 用来表示content, 检查这个字段可以避免生成和当前一样的modal,然后并不缓存更多资源
     */
    constructor(content, id) {
        this._modal = $(modalTpl)
        this.id = id

        this._modal.on('click', '.overlay, .close', () => this.close())

        content && this._modal.find('.wrapper').html(content)
        $(document.body).append(this._modal)
    }
    close() {
        this._modal.hide()
    }
    open() {
        this._modal.show()
    }
    replace(content, id) {
        this._modal.find('.wrapper').html(content)
        this._modal.id = id
        return this
    }
    on() {
        this._modal.on(...arguments)
    }
}