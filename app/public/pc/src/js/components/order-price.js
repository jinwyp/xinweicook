import {__} from '../utils/locale'

import React from 'react'

function fixed(number, digit) {
    digit = digit != undefined ? digit : 1
    return number.toFixed(digit)
}

var OrderPrice = React.createClass({
    render() {
        var props = this.props
        var usedBalance = props.payPrice >= props.totalBalance ? props.totalBalance : props.payPrice
        var onlinePayPrice = props.payPrice
        if (props.useBalance) {
            onlinePayPrice -= usedBalance
        }
        return (
            <div className="price-section">
                <div className="item">
                    <span>{__('Price')}</span><span className="rmb-char">{fixed(props.cartPrice)}</span>
                </div>
                <div className="item">
                    <span><span>{__("Shipping rates")}</span><i>（{__("满100免运费")}）</i></span>
                    <span className="rmb-char">{fixed(props.freight)}</span>
                </div>
                {
                    props.couponPrice ? (
                        <div className="item">
                            <span>{__("Discount amount")}</span><span className="rmb-char negative">{fixed(props.couponPrice)}</span>
                        </div>
                    ) : ''
                }
                {
                    props.useBalance ? (
                        <div className="item">
                            <span>{__("Xinwei balance")}</span><span className="rmb-char negative">{fixed(usedBalance)}</span>
                        </div>
                    ) : ''
                }
                <div className="item">
                    <span>{__('Subtotal')}</span><span><strong className="rmb-char">{fixed(onlinePayPrice)}</strong></span>
                </div>
            </div>
        )
    }
})

export default OrderPrice