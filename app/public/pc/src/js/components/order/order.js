import {lang} from '../../utils/locale'
import {__} from '../../utils/locale'

import React from 'react'
import {imgAdapt as adapt, orderStatus} from '../../utils/filters'
import {price} from '../../utils/dish'
import {dateFormat} from '../../utils/utils'

var l = lang()

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
                                <span className="img" style={{backgroundImage: `url(${adapt(item.dish.cover[0][l], 75, 50)})`}}></span>
                                <span className="name" title={item.dish.title[l]}>{item.dish.title[l]}</span>
                                <span className="number cross-char">{item.number}</span>
                            </div>
                            <div>{dateFormat(props.deliveryDateTime)}</div>
                            <div className="rmb-char">{price(item)}</div>
                            <div>{i === 0 && orderStatus(props.status)}</div>
                            {props.status == 'not paid' && i===0 &&
                                <div className="tc">
                                    <span onClick={()=>props.cancel(props._id)}>{__('Cancel')}</span>
                                    <span onClick={()=>props.pay(props._id)}>{__('Pay')}</span>
                                </div>
                            }
                        </div>
                    ))
                }
            </div>
        )
    }
})

export default Order