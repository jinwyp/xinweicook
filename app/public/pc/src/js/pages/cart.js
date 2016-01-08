import {init as initCommon} from './common' //no react. for html header

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import configureCartStore from '../stores/configureCartStore'

import * as cartAction from "../actions/cart"
import * as addressAction from "../actions/address"
import * as timeAction from "../actions/time"
import * as couponAction from "../actions/coupon"
import * as balanceAction from "../actions/balance"
import * as freightAction from "../actions/freight"
import * as commentAction from "../actions/comment"
import * as orderAction from "../actions/order"

import Cart from "../components/cart/cart"
import AddressList from "../components/address/address-list"
import TimeSelector from "../components/time-selector"
import CartCoupon from "../components/coupon/cart-coupon"
import OrderPrice from "../components/order-price"
import Comment from "../components/comment"

import {price as dishPrice} from "../utils/dish"

var App = React.createClass({
    componentDidMount: function () {
        this.props.dispatch(cartAction.getCart()).then(res => {
            // [NOT react]
            initCommon(res)
        })
        this.props.dispatch(balanceAction.getBalance())
    },
    getFreightIfNeeded: function (cart, address, dispatch) {
        return cart.some(el => el.selected)
            && address.addresses.some(el => el.selected)
            && dispatch(freightAction.getFreight())
    },
    postOrder: function (cart, address, time, dispatch) {
        cart = cart.filter(item => item.selected)
        if (!cart.length) return
        if (!address.addresses.some(item => item.selected)) return
        var cookingTypes = {}
        cart.forEach(item => {
            cookingTypes[item.dish.cookingType] = true
        })
        Object.keys(cookingTypes).every(type => {
            type = type == 'ready to cook' ? 'cook' : 'eat'
            return !!time[type].selectedTime
        }) && dispatch(orderAction.postOrder())
    },
    render: function () {
        const {warehouse, cart, dispatch, address, time,
            coupon, balance, freight} = this.props;

        var cartMethods = {
            selectOne: id=> {
                dispatch(cartAction.selectOne(id))
                dispatch(timeAction.getTimeIfNeeded())
                this.getFreightIfNeeded(cart, address, dispatch)
            },
            selectAll: cookingType=> {
                dispatch(cartAction.selectAll(cookingType))
                dispatch(timeAction.getTimeIfNeeded())
                this.getFreightIfNeeded(cart, address, dispatch)
            },
            plusDish: id=> {
                dispatch(cartAction.plusDish(id))
            },
            minusDish: id=> {
                dispatch(cartAction.minusDish(id))
            },
            delDish: id=>{
                dispatch(cartAction.delDish(id))
                dispatch(timeAction.getTimeIfNeeded())
                this.getFreightIfNeeded(cart, address, dispatch)
            }
        }
        var addressMethods = {
            addOne: ()=>dispatch(addressAction.editAddress()),
            modifyOne: id => dispatch(addressAction.editAddress(id)),
            getList: () => dispatch(addressAction.getList()),
            putOne: address => dispatch(addressAction.putOne(address)),
            postOne: address => dispatch(addressAction.postOne(address)),
            delOne: id => dispatch(addressAction.delOne(id)),
            close: () => dispatch(addressAction.closeEditAddress()),
            toggleStreet: (show) => dispatch(addressAction.toggleStreet(show)),
            getStreet: (query, region) => dispatch(addressAction.getStreet(query, region)),
            getRange: () => dispatch(addressAction.getRangeIfNeeded()),
            select: (id, _address) => {
                dispatch(addressAction.select(id, _address))
                dispatch(timeAction.getTimeIfNeeded())
                this.getFreightIfNeeded(cart, address, dispatch)
            }
        }
        var timeMethods = {
            selectTime: (time, cookingType)=>dispatch(timeAction.selectTime(time, cookingType))
        }
        var commentMethods = {
            changeComment: text => dispatch(commentAction.changeComment(text))
        }
        var couponMethods = {
            selectCard: (id) => dispatch(couponAction.selectCard(id, price.payPrice)),
            getCouponCode: code => dispatch(couponAction.getCouponCode(code)),
            toggleBalance: () => dispatch(balanceAction.toggleBalance(price.payPrice))
        }

        var postOrder = (cart)=> {
            cart = cart.filter(item => item.selected)
            if (!cart.length) return
            if (!address.addresses.some(item => item.selected)) return
            var cookingTypes = {}
            cart.forEach(item => {
                cookingTypes[item.dish.cookingType] = true
            })
            console.log('balance, b.total, price.pay', balance, balance.totalBalance, price.payPrice)
            Object.keys(cookingTypes).every(type => {
                type = type == 'ready to cook' ? 'cook' : 'eat'
                return !!time[type].selectedTime
            }) && dispatch(orderAction.postOrder(balance.useBalance && (balance.totalBalance >= price.payPrice)))
        }

        // 价格是根据购物车,优惠券,运费计算出来的,所以没必要单独为其建立reducer
        var price = {
            cartPrice: cart.filter(el => el.selected).reduce((p, el) => p + dishPrice(el), 0),
            freight: freight,
            couponPrice: (coupon.card.selectedCard && coupon.card.selectedCard.price + coupon.code.price) || 0
        }
        price.payPrice = price.cartPrice + price.freight - price.couponPrice

        var hasEatDishSelected = cart.some(item => item.dish.cookingType == 'ready to eat' && item.selected)
        var hasCookDishSelected = cart.some(item => item.dish.cookingType == 'ready to cook' && item.selected)

        return (
            <div className="cart-main">
                <div className="cart-main-left">
                    <Cart methods={cartMethods} cart={cart} warehouse={warehouse}/>
                </div>
                <div className="cart-main-right">
                    <AddressList {...address} {...addressMethods}/>
                    {hasEatDishSelected && <TimeSelector {...timeMethods} {...time.eat}/>}
                    {hasCookDishSelected && <TimeSelector {...timeMethods} {...time.cook}/>}
                    <Comment {...commentMethods}/>
                    <CartCoupon {...couponMethods} {...coupon} {...balance} payPrice={price.payPrice}/>
                    <OrderPrice {...price}/>
                    <div className="confirm-section">
                        <button onClick={()=>postOrder(cart)}>在线支付</button>
                    </div>
                </div>
            </div>
        );
    }
});

var WrappedApp = connect(state => state)(App)

var store = configureCartStore()

var rootElement = document.getElementById('react-root')

ReactDom.render(
    <Provider store={store}><WrappedApp/></Provider>,
    rootElement
)

