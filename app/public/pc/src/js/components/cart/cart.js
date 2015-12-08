import React from 'react'
import CartDish from './cart-dish-list'

var Cart = React.createClass({

    render: function () {
        const {dishList, stockWarehouse} = this.props
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
                Object.keys(dishList).map(
                    name => {
                        var title = name == 'cookList' ? '食材包' : '便当'
                        return (
                            <div class="tabbtn clearfix"><a href="javascript:;" class="cook act">{title}</a></div>
                            <CartDish {...props.methods} dishList={dishList[name]} stockWarehouse={stockWarehouse}/>
                        )
                    }
                )
            </div>
        )
    }
});

export default CartDishList;