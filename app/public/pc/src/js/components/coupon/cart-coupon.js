import {__, lang} from '../../utils/locale'

import React from 'react'
import cls from '../../utils/class-name'

var l = lang()

var CartCoupon = React.createClass({

    getInitialState() {
        return {
            isPending: false,
            error: {
                couponCode: {
                    format: false,
                    mightInviteCode: false
                }
            },
            showOptionPanel: false
        }
    },

    toggleOptionPanel() {
        this.setState({
            showOptionPanel: !this.state.showOptionPanel
        })
    },

    selectCard(id) {
        this.props.selectCard(id)
        this.toggleOptionPanel()
    },

    onBlur() {
        this.validate()
        var couponCode = this.state.error.couponCode
        var value = this.refs.couponCode.value
        if (value && Object.keys(couponCode).every(key => !couponCode[key])) {
            this.props.getCouponCode(this.refs.couponCode.value)
        }
    },

    validate() {
        var code = this.refs.couponCode.value
        if (!code) return
        if (!/^1a\w{6}$|^\w{10}$/.test(code)) {
            var error = {}
            if (code.length == 8) {
                error.mightInviteCode = true
            } else {
                error.format = true
            }
            this.setState({
                error: Object.assign({}, this.state.error, {couponCode: error})
            })
        } else {
            this.setState({error: {couponCode: {}}})
        }
    },

    // todo: 增加兑换邀请码链接, 30天内有108个用户点击了微信端的那个提示链接, 说明这个无心添加很有用啊
    render: function () {
        var props = this.props
        var cardList = this.props.card.cardList.filter(card => !card.isExpired && !card.isUsed)
        var usedBalance = props.totalBalance >= props.payPrice ?
                props.payPrice : props.totalBalance
        return (
            <div className="coupon-section">
                <div className="form-control-group">
                    <label htmlFor="coupon-code">{__('Promo code')}</label>
                    <input ref="couponCode" onBlur={this.onBlur} autoComplete="off" placeholder={__('Promo code')} className="coupon-code" type="text" id="coupon-code"/>
                    {/*
                        this.state.error.couponCode.mightInviteCode &&
                        <span className="err-tip exchange-invite-code">优惠码无效<a href={"/pc/coupons?code=" + this.refs.couponCode.value}>(兑换邀请码?)</a></span>
                     */}
                    { this.state.error.couponCode.format && <span className="err-tip">{__('Invalid Promo code')}</span> }
                </div>
                <div style={{display: cardList.length ? 'block' : 'none'}} className="form-control-group coupon-card-group">
                    <CardOptionPanel cardList={cardList} selectCard={this.selectCard} isShow={this.state.showOptionPanel}/>
                    <label>{__("Coupon code")}</label>
                    <span className="coupon-card" onClick={this.toggleOptionPanel}>
                        {
                            props.card.selectedCard ?
                                <span>{props.card.selectedCard.name[l] + `(¥${props.card.selectedCard.price})`}</span> :
                                <span>{__("Choose a coupon code")}</span>
                        }
                        <i className="fa fa-angle-down"></i>
                    </span>
                </div>
                <div className="group">
                    <span onClick={props.toggleBalance} className={'fa ' + (props.useBalance ? 'fa-check-square-o' : 'fa-square-o')}></span>
                    <span className="text">{__("Use Xinwei balance to pay")}</span>
                    {
                        props.useBalance ?
                            <span className="rmb-char">{usedBalance + '(' + __("Remaining") + ' ¥' + (props.totalBalance - usedBalance) + ')'}</span> :
                            <span className="rmb-char">{props.totalBalance}</span>
                    }
                </div>
            </div>
        )
    }
});

export default CartCoupon;

var CardOptionPanel = React.createClass({
    render: function () {
        var props = this.props

        return (
            <div className="card-option-panel" style={{display: props.isShow ? 'block' : 'none'}}>
                <h5>{__("Choose a coupon code")}</h5>
                <ul>
                    <li onClick={() => props.selectCard()}>{__("Don't use")}</li>
                    {
                        props.cardList.map((card, i) =>
                            <li key={card._id} onClick={() => props.selectCard(card._id)}>{card.name[l] + `(¥${card.price})`}</li>)
                    }
                </ul>
            </div>
        )
    }
})