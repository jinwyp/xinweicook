import 'babel-polyfill'

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import configureCartStore from '../stores/configureCartStore'
import * as cartAction from "../actions/cart"
import * as addressAction from "../actions/address"
import Cart from "../components/cart/cart"
import AddressList from "../components/address/address-list"

var App = React.createClass({
    componentDidMount: function () {
        this.props.dispatch(cartAction.getCart())
        this.props.dispatch(addressAction.getList())
    },
    render: function () {
        const {warehouse, cart, dispatch, address, user} = this.props;
        var cartMethods = {
            selectOne: (id)=>dispatch(cartAction.selectOne(id)),
            selectAll: (cookingType)=>dispatch(cartAction.selectAll(cookingType)),
            plusDish: (id)=>dispatch(cartAction.plusDish(id)),
            minusDish: (id)=>dispatch(cartAction.minusDish(id)),
            delDish: (id)=>dispatch(cartAction.delDish(id))
        }
        var addressMethods = {
            addOne: ()=>dispatch(addressAction.editAddress()),
            select: (id, warehouse) => dispatch(addressAction.select(id, warehouse)),
            getList: () => dispatch(addressAction.getList()),
            putOne: address => dispatch(addressAction.putOne(address)),
            postOne: address => dispatch(addressAction.postOne(address)),
            delOne: id => dispatch(addressAction.delOne(id))
        }
        return (
            <div className="cart-main">
                <Cart methods={cartMethods} cart={cart} warehouse={warehouse}/>
                <div className="cart-main-right">
                    <AddressList {...address} {...addressMethods} warehouse={warehouse}/>
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

