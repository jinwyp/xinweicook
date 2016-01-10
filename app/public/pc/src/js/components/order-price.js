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
                    <span>价格</span><span className="rmb-char">{fixed(props.cartPrice)}</span>
                </div>
                <div className="item">
                    <span><span>运费</span><i>（满100免运费）</i></span>
                    <span className="rmb-char">{fixed(props.freight)}</span>
                </div>
                {
                    props.couponPrice ? (
                        <div className="item">
                            <span>优惠</span><span className="rmb-char negative">{fixed(props.couponPrice)}</span>
                        </div>
                    ) : ''
                }
                {
                    props.useBalance ? (
                        <div className="item">
                            <span>新味币</span><span className="rmb-char negative">{fixed(usedBalance)}</span>
                        </div>
                    ) : ''
                }
                <div className="item">
                    <span>总计</span><span><strong className="rmb-char">{fixed(onlinePayPrice)}</strong></span>
                </div>
            </div>
        )
    }
})

export default OrderPrice