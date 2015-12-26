import React from 'react'
import cls from '../../utils/class-name'

var CartDish = React.createClass({

    render: function () {
        var {dish, number, subDish, selected, _id} = this.props;
        var props = this.props
        var price = subDish.reduce((sum, el) => el.dish.priceOriginal + sum,
            dish.priceOriginal)
        return (
            <div className={'cart-dish' + (props.noStock ? ' no-stock': '')}>
                <span onClick={() => props.selectOne(_id)} className={selected ? 'fa fa-check-square-o' : 'fa fa-square-o'}></span>
                <div className="dish-info">
                    <div className="content-wrapper">
                        <img src={dish.cover[0].zh}/>
                        <span className="main-dish" title={dish.title.zh}>{dish.title.zh}</span>
                        {
                            subDish.map((el) => <span className="sub-dish" key={el.dish._id}>{el.dish.title.zh + ' '}</span>)
                        }
                    </div>
                    <div className="no-stock-mask">当前地址便当不可送达</div>
                </div>
                <div className="quantity">
                    <span className={"square-icon" + (number == 1 ? ' disabled' : '')} onClick={() => number != 1 && props.minusDish(_id)}>-</span>
                    <span className="number">{number}</span>
                    <span className="square-icon" onClick={() => props.plusDish(_id)}>+</span>
                </div>
                <div className="price rmb-char">{price}</div>
                <span className="fa fa-times" onClick={() => props.delDish(_id)}></span>
            </div>
        )
    }
});

export default CartDish;