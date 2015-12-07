import React from 'react'

var CartDish = React.createClass({

    render: function () {
        var {dish, number, subDish} = this.props;
        return (
            <div className="cart-dish">
                <div className="dish-info">
                    <img src={dish.cover[0].zh}/>
                    <span className="main-dish">{dish.title.zh}</span>
                    {
                        subDish.map((el) => <span className="sub-dish">{el.dish.title.zh}</span>)
                    }
                </div>
            </div>
        )
    }
});

export default CartDish;