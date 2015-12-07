import React from 'react'

var CartDish = React.createClass({

    render: function () {
        var {dish, number, subDish, add, del} = this.props;
        var price = subDish.reduce((sum, el) => el.dish.priceOriginal + sum,
            dish.priceOriginal)
        return (
            <div className="cart-dish">
                <div className="dish-info">
                    <img src={dish.cover[0].zh}/>
                    <span className="main-dish">{dish.title.zh}</span>
                    {
                        subDish.map((el) => <span className="sub-dish">{el.dish.title.zh + ' '}</span>)
                    }
                </div>
                <div className="quantity">
                    <span onClick="del">-</span>{number}<span onClick="add">+</span>
                </div>
                <div className="price rmb-char">{price}</div>
            </div>
        )
    }
});

export default CartDish;