import React from 'react'

var CartDish = React.createClass({

    render: function () {
        var {dish, number, subDish, selected} = this.props;
        var props = this.props
        var price = subDish.reduce((sum, el) => el.dish.priceOriginal + sum,
            dish.priceOriginal)
        return (
            <div className="cart-dish">
                <span onClick="props.select" className={dish.selected ? 'fa fa-check-square-o' : 'fa fa-square-o'}></span>
                <div className="dish-info">
                    <img src={dish.cover[0].zh}/>
                    <span className="main-dish">{dish.title.zh}</span>
                    {
                        subDish.map((el) => <span className="sub-dish" key={el.dish._id}>{el.dish.title.zh + ' '}</span>)
                    }
                </div>
                <div className="quantity">
                    <span onClick="props.minus">-</span>{number}<span onClick="props.plus">+</span>
                </div>
                <div className="price rmb-char">{price}</div>
                <span></span>
            </div>
        )
    }
});

export default CartDish;