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
                <div class="wrapper">Add to Shopping Bag</div>
            </div>
        </div>
    </div>
`