import {lang} from '../utils/locale'

var l = lang()

export var propertySelection = `
    <div class="multi-dish-selection" data-id="{{_id}}">
        <span class="close close-icon"></span>
        <h4>{{title.${l}}}</h4>
        <div class="content">

            <ul class="selections">
                {{#each preferences}}
                <li data-id="{{this._id}}">
                    <h5 class="title icon-wave">{{this.name.${l}}}</h5>
                    <ul class="properties clearfix">
                        {{#each this.foodMaterial}}
                        <li title="{{this.dish.title.${l}}}" data-id="{{this._id}}">{{this.dish.title.${l}}}</li>
                        {{/each}}
                    </ul>
                </li>
                {{/each}}
            </ul>

            <div class="num-container">
                <h5 class="title icon-wave">Quantity</h5>
                <div class="quantity">
                    <span class="square-icon disabled minus">-</span>
                    <span class="number">{{number}}</span>
                    <span class="square-icon plus">+</span>
                </div>
            </div>

            <div class="add-to-cart">
                <div class="wrapper">加入购物袋</div>
            </div>
        </div>
    </div>
`

export var addressSelection = `
<div id="xw-special-middle" class="address-selection">
    <form>
        <div class="province form-control-group select">
            <label for="province">请选择所在的省份</label>
            <select name="province" id="province">
            {{#each province}}
                <option value="{{this}}">{{this}}</option>
            {{/each}}
            </select>
        </div>
        <div style="display:none;" class="address form-control-group">
            <label for="address">请输入收货地址</label>
            <input autocomplete="off" type="text" name="address" id="address"/>
            <ul class="street-list">
            </ul>
        </div>
    </form>
</div>
`

export var streetItem = `
<li data-lat="{{lat}}" data-lng="{{lng}}">
    <div class="name">{{address}}</div>
    <div class="address">{{addressInfoBaidu}}</div>
</li>
`