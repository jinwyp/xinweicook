import React from 'react'
import CartDish from './cart-dish'

var CartDishList = React.createClass({

    _hasStock: function (item, stockWarehouse) {
        var mDish = item.dish;
        return item.dish.stockWarehouse[stockWarehouse] > 0
            && item.subDish.every(it=>this.hasStock(it, stockWarehouse))
    }

    render: function () {
        const {dishList, stockWarehouse} = this.props
        const props = this.props
        var selectedAll = dishList.every(item =>
            item.selected || this._hasStock(item, stockWarehouse))
        var selectedAll = selectedAll && dishList.some(item => item.selected)

        return (
            <div className="cart-dish-list">
                <div className="header">
                    <span onClick="props.selectAll" className={selectedAll ? 'fa fa-square-o' : 'fa fa-check-square-o'}></span>
                    <span>全选</span>
                    <span>数量</span>
                    <span>价格</span>
                </div>
                <ul className="dish-list">
                    {
                        dishList.map(item =>
                            <li key={item._id}>

                                <CartDish key={item._id} {...item} minus={props.minus} plus={props.plus}/>
                            </li>
                        )
                    }
                </ul>
            </div>
        )
    }
});

export default CartDishList;