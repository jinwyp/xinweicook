import 'babel-polyfill'

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import configureCartStore from '../stores/configureCartStore'
import * as cartAction from "../actions/cart"
import * as addressAction from "../actions/address"
import * as timeAction from "../actions/time"
import Cart from "../components/cart/cart"
import AddressList from "../components/address/address-list"
import TimeSelector from "../components/time-selector"
import CartCoupon from "../components/coupon/cart-coupon"

var App = React.createClass({
    componentDidMount: function () {
        this.props.dispatch(cartAction.getCart())
        this.props.dispatch(addressAction.getList())
    },
    render: function () {
        const {warehouse, cart, dispatch, address, user, time} = this.props;
        var cartMethods = {
            selectOne: id=> {
                dispatch(cartAction.selectOne(id))
                dispatch(timeAction.getTimeIfNeeded())
            },
            selectAll: cookingType=> {
                dispatch(cartAction.selectAll(cookingType))
                dispatch(timeAction.getTimeIfNeeded())
            },
            plusDish: id=>dispatch(cartAction.plusDish(id)),
            minusDish: id=>dispatch(cartAction.minusDish(id)),
            delDish: id=>{
                dispatch(cartAction.delDish(id))
                dispatch(timeAction.getTimeIfNeeded())
            }
        }
        var addressMethods = {
            addOne: ()=>dispatch(addressAction.editAddress()),
            getList: () => dispatch(addressAction.getList()),
            putOne: address => dispatch(addressAction.putOne(address)),
            postOne: address => dispatch(addressAction.postOne(address)),
            delOne: id => dispatch(addressAction.delOne(id)),
            select: (id, address) => {
                dispatch(addressAction.select(id, address))
                dispatch(timeAction.getTimeIfNeeded())
            }
        }
        var timeMethods = {
            selectTime: (time, cookingType)=>dispatch(timeAction.selectTime(time, cookingType))
        }
        var hasEatDishSelected = cart.some(item => item.dish.cookingType == 'ready to eat' && item.selected)
        var hasCookDishSelected = cart.some(item => item.dish.cookingType == 'ready to cook' && item.selected)
        return (
            <div className="cart-main">
                <Cart methods={cartMethods} cart={cart} warehouse={warehouse}/>
                <div className="cart-main-right">
                    <AddressList {...address} {...addressMethods} warehouse={warehouse}/>
                    {hasEatDishSelected && <TimeSelector {...timeMethods} {...time.eat}/>}
                    {hasCookDishSelected && <TimeSelector {...timeMethods} {...time.cook}/>}
                    <CartCoupon />
                </div>
            </div>
        );
    }
});

var WrappedApp = connect(state => state)(App);

var store = configureCartStore();

var rootElement = document.getElementById('react-root');

ReactDom.render(
    <Provider store={store}><WrappedApp/></Provider>,
    rootElement
);

