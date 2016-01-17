import {__} from '../../utils/locale'

import React from 'react'
import Order from './order'

var OrderList = React.createClass({

    getInitialState() {
        return {
            curPage: 0
        }
    },

    componentDidMount() {
        this.props.getOrders()
    },

    _goto(page) {
        var length = (this.props.orders || []).length
        if (!length) return
        var curPage = this.state.curPage
        if (page == 'next') {
            this.setState({
                curPage: (curPage + 1) % length
            })
        } else if (page == 'prev') {
            this.setState({
                curPage: (curPage - 1) % length
            })
        } else this.setState({
            curPage: page
        })
    },

    _limit: 5,

    render() {
        var orders = this.props.orders || []
        var pages = [], paginations = []
        for (var i = 0; i < orders.length; i+=this._limit) {
            pages.push(orders.slice(i, i + this._limit))
            paginations.push(i/this._limit)
        }
        if (!paginations.length) {
            paginations.push(0)
        }
        var curOrders = pages[this.state.curPage] || []
        return (
            <section className="orders">
                <h4>
                    <span>{__('Order Number')}</span>
                    <span>{__('Dish')}</span>
                    <span>{__('Delivery Time')}</span>
                    <span>{__('Amount')}</span>
                    <span>{__('Status')}</span>
                </h4>
                <ul className="order-list">
                    {
                        curOrders.map(order => (
                            <li key={order._id}>
                                <Order {...order}/>
                            </li>
                        ))
                    }
                </ul>
                <nav className="clearfix">
                    <ul className="pagination fr">
                        <li>
                            <a href="javascript:;" onClick={() => this._goto('prev')}>
                                <span>&laquo;</span>
                            </a>
                        </li>
                        {
                            paginations.map(el =>
                                <li key={el} className={el == this.state.curPage ? 'active' : ''}><a href="javascript:;" onClick={()=>this._goto(el)}>{el + 1}</a></li>
                            )
                        }
                        <li>
                            <a href="javascript:;" onClick={() => this._goto('next')}>
                                <span>&raquo;</span>
                            </a>
                        </li>
                    </ul>
                </nav>
            </section>
        )
    }
})

export default OrderList