import React from 'react'
import {imgAdapt as adapt, orderStatus} from '../../utils/filters'
import {price} from '../../utils/dish'
import {dateFormat} from '../../utils/utils'

var Order = React.createClass({
    render() {
        var props = this.props
        return (
            <div>
                {
                    props.dishList.filter(item => !!item.dish).map((item, i) => (
                        <div key={i} className="dish">
                            <div>{i === 0 && props.orderNumber}</div>
                            <div className="detail">
                                <span className="img" style={{backgroundImage: `url(${adapt(item.dish.cover[0].zh, 75, 50)})`}}></span>
                                <span className="name" title={item.dish.title.zh}>{item.dish.title.zh}</span>
                                <span className="number cross-char">{item.number}</span>
                            </div>
                            <div>{dateFormat(props.deliveryDateTime)}</div>
                            <div className="rmb-char">{price(item)}</div>
                            <div>{i === 0 && orderStatus(props.status)}</div>
                            {/*<div><span className="unrated">尚未评价</span><span className="unrated-icon"></span></div>*/}
                        </div>
                    ))
                }
            </div>
        )
    }
})

export default Order