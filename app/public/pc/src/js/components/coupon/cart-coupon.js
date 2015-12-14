import React from 'react'
import cls from '../../utils/class-name'

var CartCoupon = React.createClass({

    render: function () {
        return (
            <div className="coupon-section">
                <div className="form-control-group">
                    <label htmlFor="coupon-code">优惠码</label>
                    <input autoComplete="off" placeholder="优惠码" className="coupon-code" type="text" id="coupon-code"/>
                </div>
                <div className="form-control-group">
                    <label>优惠券</label>
                    <span className="coupon-card"><i className="fa fa-angle-down"></i></span>
                </div>
                <div className="group">
                    <span className="fa fa-check-square-o"></span>
                    <span className="text">使用余额</span>
                    <span className="rmb-char">300</span>
                </div>
            </div>
        )
    }
});

export default CartCoupon;