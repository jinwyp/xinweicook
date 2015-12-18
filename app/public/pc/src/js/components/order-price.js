import React from 'react'

function fixed(number, digit) {
    digit = digit != undefined ? digit : 1
    return number.toFixed(digit)
}

var OrderPrice = React.createClass({
    render() {
        var props = this.props
        return (
            <div className="price-section">
                <div className="item">
                    <span>价格</span><span className="rmb-char">{fixed(props.cartPrice)}</span>
                </div>
                {
                    props.couponPrice ? (
                        <div className="item">
                            <span>优惠</span><span className="rmb-char negative">{fixed(props.couponPrice)}</span>
                        </div>
                    ) : ''
                }
                <div className="item">
                    <span><span>运费</span><i>（满100免运费）</i></span>
                    <span className="rmb-char">{fixed(props.freight)}</span>
                </div>
                <div className="item">
                    <span>总计</span><span><strong className="rmb-char">{fixed(props.payPrice)}</strong></span>
                </div>
            </div>
        )
    }
})

export default OrderPrice