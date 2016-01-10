"use strict";

// for html header(not react) &
import {init as initCommon} from './common'

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import configureMeStore from '../stores/configureMeStore'

import * as addressAction from "../actions/address"
import * as couponAction from "../actions/coupon"
import * as balanceAction from "../actions/balance"
import * as orderAction from "../actions/order"
import * as routeAction from '../actions/route'
import * as userAction from '../actions/user'

import AddressList from "../components/address/address-list"
import OrderList from "../components/order/order-list"

var App = React.createClass({

    componentDidMount: function () {
        this.props.dispatch(userAction.getUserIfNeeded()).then(res => {
            // [NOT react]
            initCommon(res)
        })
        window.addEventListener('hashchange', () => {
            this.props.dispatch(routeAction.changeRoute(window.location.hash.substr(1)))
        })
    },

    methods: {},

    render: function () {
        const {dispatch, address, user, coupon, balance, route, order} = this.props

        if (!this.methods.order) {
            this.methods.order = {
                getOrders: (skip, limit) => {
                    dispatch(orderAction.getOrders(skip, limit))
                }
            }
            this.methods.addressList = {
                addOne: ()=>dispatch(addressAction.editAddress()),
                modifyOne: id => dispatch(addressAction.editAddress(id)),
                getList: () => dispatch(addressAction.getList()),
                putOne: address => dispatch(addressAction.putOne(address)),
                postOne: address => dispatch(addressAction.postOne(address)),
                delOne: id => dispatch(addressAction.delOne(id)),
                close: () => dispatch(addressAction.closeEditAddress()),
                toggleStreet: (show) => dispatch(addressAction.toggleStreet(show)),
                getStreet: (query, region) => dispatch(addressAction.getStreet(query, region)),
                getRange: () => dispatch(addressAction.getRangeIfNeeded())
            }
        }

        var Child
        switch (route) {
            case 'orders':
                Child = <OrderList {...this.methods.order} orders={order.orders}/>;
                break;
            case 'userinfo':
                Child = <AddressList hideRadio={true} title='配送地址' {...this.methods.addressList} {...address}/>;
                break;
            default: Child = null;
        }

        return (     
            <div className="main">
                <nav className="nav">
                    <ul>
                        <li className={route == 'orders' && 'act'}><a href="#orders">我的订单</a></li>
                        <li className={route == 'charge' && 'act'}><a href="#charge">我要充值</a></li>
                        <li className={route == 'consumption' && 'act'}><a href="#consumption">交易明细</a></li>
                        <li className={route == 'userinfo' && 'act'}><a href="#userinfo">我的信息</a></li>
                        <li className={route == 'custom' && 'act'}><a href="#custom">私人定制</a></li>
                        <li className={route == 'ratings' && 'act'}><a href="#ratings">评过的菜</a></li>
                    </ul>
                </nav>
                <div className="content">
                    {Child}
                </div>
            </div>
        )
    }
});

var WrappedApp = connect(state => state)(App)

var store = configureMeStore()

var rootElement = document.getElementById('react-root')

ReactDom.render(
    <Provider store={store}><WrappedApp/></Provider>,
    rootElement
)

