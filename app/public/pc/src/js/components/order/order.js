import React from 'react'

var Order = React.createClass({
    
    render() {
        var props = this.props
        return (
            <div>
                {
                    props.dishHistory.map((item, i) => (
                        <div className="dish">
                            <div>{i === 0 && props.orderNumber}</div>
                            <div className="detail">
                                <span className="img" style={{backgroundImage: `url(${item.cover[0].zh})`}}></span>
                                <span className="name">味增罗非鱼</span>
                                <span className="number">1</span>
                            </div>
                            <div>2015-05-06 16:19</div>
                            <div className="rmb-char">106.00</div>
                            <div>未付款</div>
                            <div><span className="unrated">尚未评价</span><span className="unrated-icon"></span></div>
                        </div>
                    ))
                }
                <div className="dish">
                    <div>{props.orderNumber}</div>
                    <div className="detail">
                        <span className="img"></span>
                        <span className="name">味增罗非鱼</span>
                        <span className="number">1</span>
                    </div>
                    <div>2015-05-06 16:19</div>
                    <div className="rmb-char">106.00</div>
                    <div>未付款</div>
                    <div><span className="unrated">尚未评价</span><span className="unrated-icon"></span></div>
                </div>
            </div>
        )
    }
})