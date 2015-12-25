import React from 'react'
import Order from './order'

var OrderList = React.createClass({

    componentDidMount() {
        this.props.getOrders()
    },

    render() {
        var props = this.props
        return (
            <section className="orders">
                <h4>
                    <span>订单</span>
                    <span>菜品</span>
                    <span>配送时间</span>
                    <span>金额</span>
                    <span>状态</span>
                </h4>
                <ul>
                    {
                        props.orders.map(order => (
                            <li key={order._id}>
                                <Order {...order}/>
                            </li>
                        ))
                    }
                </ul>
            </section>
        )
    }
})

export default OrderList