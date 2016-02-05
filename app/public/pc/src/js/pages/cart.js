import {init as initCommon} from './common' //no react. for html header

import {__} from '../utils/locale'

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

import * as header from '../pages/header'

import {price as dishPrice} from "../utils/dish"

var CJDishId =  '56988143247c25ce3fa59a01'
var QRJDishId = '56a4dc2097fdeb3361dcc7b1'

var App = React.createClass({
    componentDidMount: function () {
        this.props.dispatch(cartAction.getCart()).then(res => {
            // [NOT react]
            initCommon(res)
        })
        this.props.dispatch(balanceAction.getBalance())
    },
    componentDidUpdate: function (prevProps) {
        // update the header which is not a react component
        var prevCart = prevProps.cart
        var newCart
        if (prevCart) {
            newCart = this.props.cart
            if (newCart.length != prevCart.length) {
                header.cart(newCart)
            }
        }
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
        const {warehouse, dispatch, address, time,
            coupon, balance, freight} = this.props;
        var cart = this.props.cart

        var cartLoaded = !!cart
        cart = cart || []
        var hasSelectedOne = cart.some(item => item.selected)

        var cartMethods = {
            selectOne: id=> {
                // todo: 情人节特殊处理
                var isQRJSelected, isCJSelected
                var item = cart.filter(el => el._id == id)[0]
                var _id = item.dish._id
                cart.filter(el => el.dish.cookingType == 'ready to cook' && el.selected)
                    .forEach(el => {
                        if (el.dish._id == QRJDishId) {
                            isQRJSelected = true
                        } else if (el.dish._id == CJDishId) {
                            isCJSelected = true
                        }
                    })
                if (isQRJSelected) {
                    if (_id == CJDishId) {
                        alert(__('Clash info for the two days'))
                        return
                    }
                }
                if (isCJSelected) {
                    if (_id == QRJDishId) {
                        alert(__('Clash info for the two days'))
                        return
                    }
                }
                var selectedAddress
                address.addresses.some(el => {
                    if (el.selected) {
                        selectedAddress = el
                        return true
                    }
                })
                var JZHW = ['江苏', '浙江', '上海', '安徽']
                var hasJZHWAddress = address.addresses.some(el => JZHW.indexOf(el.province) != -1)
                if ((selectedAddress && JZHW.indexOf(selectedAddress.province) == -1 && _id == QRJDishId) ||
                    (!hasJZHWAddress && _id == QRJDishId)
                ) {
                    alert(__('Valentine day only for JZHW'))
                    return
                }

                dispatch(cartAction.selectOne(id, !item.selected))
                dispatch(timeAction.getTimeIfNeeded())
                this.getFreightIfNeeded(cart, address, dispatch)
            },
            selectAll: cookingType=> {
                // todo: 情人节特殊处理
                var hasQRJ, hasCJ
                var cookList = cart.filter(el => el.dish.cookingType == 'ready to cook')
                hasQRJ = cookList.some(el => el.dish._id == QRJDishId)
                hasCJ = cookList.some(el => el.dish._id == CJDishId)
                if (hasQRJ && hasCJ) {
                    alert(__('Clash info for the two days'))
                    return
                }
                var selectedAddress
                address.addresses.some(el => {
                    if (el.selected) {
                        selectedAddress = el
                        return true
                    }
                })
                var JZHW = ['江苏', '浙江', '上海', '安徽']
                var hasJZHWAddress = address.addresses.some(el => JZHW.indexOf(el.province) != -1)
                if ((selectedAddress && JZHW.indexOf(selectedAddress.province) == -1 && hasQRJ) ||
                    (!hasJZHWAddress && hasQRJ)
                ) {
                    alert(__('Valentine day only for JZHW'))
                    return
                }

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
            clearStreet: () => dispatch(addressAction.clearStreet()),
            getRange: () => dispatch(addressAction.getRangeIfNeeded()),
            select: (id, _address) => {

                // todo: 情人节特殊处理
                var isQRJSelected
                cart.filter(el => el.dish.cookingType == 'ready to cook' && el.selected)
                    .forEach(el => {
                        if (el.dish._id == QRJDishId) {
                            isQRJSelected = true
                        }
                    })
                var JZHW = ['江苏', '浙江', '上海', '安徽']
                if (JZHW.indexOf(_address.province) == -1 && isQRJSelected) {
                    alert(__('Valentine day only for JZHW'))
                    return
                }

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
            Object.keys(cookingTypes).every(type => {
                type = type == 'ready to cook' ? 'cook' : 'eat'
                return !!time[type].selectedTime
            }) && dispatch(orderAction.postOrder(balance.useBalance && (balance.totalBalance >= price.payPrice)))
        }

        // 价格是根据购物车,优惠券,运费计算出来的,所以没必要单独为其建立reducer,也就是没必要有个可以根据其他state计算出的state
        var cardPrice = (coupon.card.selectedCard && coupon.card.selectedCard.price) || 0
        var codePrice = coupon.code.price || 0

        var price = {
            cartPrice: cart.filter(el => el.selected).reduce((p, el) => p + dishPrice(el), 0),
            freight: freight,
            couponPrice: cardPrice
        }
        price.payPrice = price.cartPrice + price.freight - cardPrice
        if (coupon.code.type == 'promocodepercentage') {
            codePrice = (100 - codePrice) / 100 * price.payPrice
            price.payPrice -= codePrice
            price.couponPrice += codePrice
        } else {
            price.payPrice -= codePrice
        }

        var payment = __('Pay by alipay')
        if (balance.useBalance) {
            if (price.payPrice > 0 && balance.totalBalance >= price.payPrice) {
                payment = __('pay by balance')
            } else {
                payment = __('Pay by alipay')
            }
        }
        if (price.payPrice <= 0 && hasSelectedOne) {
            price.payPrice = 0.1
        }

        var hasEatDishSelected = cart.some(item => item.dish.cookingType == 'ready to eat' && item.selected)
        var hasCookDishSelected = cart.some(item => item.dish.cookingType == 'ready to cook' && item.selected)

        return (
            <div className="cart-main">
                {
                    (cartLoaded && !cart.length)
                        ? (
                        <div className="empty-cart-tip">
                            <h4>{__("Empty shopping cart")}</h4>
                            <a href={__PCPREFIX__ + '/'}>{__("Click to see menus")}</a>
                        </div>
                    )
                        : (
                         <div>
                             <div className="cart-main-left">
                                 <Cart methods={cartMethods} cart={cart} warehouse={warehouse}/>
                             </div>
                             <div className="cart-main-right">
                                 <AddressList {...address} {...addressMethods}/>
                                 {hasEatDishSelected && <TimeSelector {...timeMethods} {...time.eat}/>}
                                 {hasCookDishSelected && <TimeSelector {...timeMethods} {...time.cook}/>}
                                 <Comment {...commentMethods}/>
                                 <CartCoupon {...couponMethods} {...coupon} {...balance} payPrice={price.payPrice}/>
                                 <OrderPrice {...price} {...balance}/>
                                 <div className="confirm-section">
                                     <button onClick={()=>postOrder(cart)}>{payment}</button>
                                 </div>
                             </div>
                         </div>
                    )
                }
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

