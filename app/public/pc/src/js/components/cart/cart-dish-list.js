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
                    <span>全选</span>
                    <span>数量</span>
                    <span>价格</span>
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