import {__} from '../../utils/locale'

import React from 'react'
import CartDishList from './cart-dish-list'

var Cart = React.createClass({

    render: function () {
        const props = this.props

        var dishList = {cookList: [], eatList: []}
        props.cart.forEach(function (item) {
            if (item.dish.cookingType == 'ready to cook') {
                dishList.cookList.push(item)
            } else {
                dishList.eatList.push(item)
            }
        })

        return (
            <div>
                {
                    Object.keys(dishList).filter(name => dishList[name].length > 0).map(
                        name => (
                            <div key={name}>
                                <div className="tabbtn clearfix"><a className="cook">{name == 'cookList' ? __('Cook') : __('Bento')}</a></div>
                                <CartDishList {...props.methods} dishList={name == 'cookList' ? dishList.cookList : dishList.eatList} warehouse={props.warehouse}/>
                            </div>
                        )
                    )
                }
            </div>
        )
    }
});

export default Cart;