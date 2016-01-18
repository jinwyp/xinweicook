import {__} from '../../utils/locale'

import React from 'react'
import CartDish from './cart-dish'

var CartDishList = React.createClass({

    render: function () {
        const {dishList} = this.props
        const props = this.props
        var cookingType = dishList[0].dish.cookingType;
        var selectedAll = dishList.every(item => item.selected || item.noStock)
            && dishList.some(item => item.selected)

        return (
            <div className="cart-dish-list">
                <div className="header">
                    <span onClick={() => props.selectAll(cookingType)} className={'fa ' + (selectedAll ? 'fa-check-square-o' : 'fa-square-o')}></span>
                    <span>{__('All')}</span>
                    <span>{__('Quantity')}</span>
                    <span>{__('Price')}</span>
                </div>
                <ul className="dish-list">
                    {
                        dishList.map(item =>
                            <li key={item._id}>
                                <CartDish {...item} minusDish={props.minusDish} plusDish={props.plusDish} delDish={props.delDish} selectOne={props.selectOne}/>
                            </li>
                        )
                    }
                </ul>
            </div>
        )
    }
});

export default CartDishList;