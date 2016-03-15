import {__} from '../utils/locale'
import {go} from '../utils/utils'

import React from 'react'

const BalanceItem = props =>
    <label className="h-bg-trans">
        <input defaultChecked={props.checked} name="chargeRadios" onClick={props.selectItem} type="radio"/>
        <span className="rmb-char">{props.price}</span>
        <span>{props.coin - props.price} -></span>
        <span className="rmb-char">{props.coin}</span>
    </label>

var chargeOptions = [
    {
        price: 480,
        coin: 500
    },
    {
        price: 980,
        coin: 1080
    },
    {
        price: 1980,
        coin: 2200
    },
    {
        price: 2980,
        coin: 3400
    }
]

var BalanceCharging = React.createClass({

    componentDidMount() {
        this.props.getBalance()
    },

    propTypes: {
        getBalance: React.PropTypes.func.isRequired,
        chargeBalance: React.PropTypes.func.isRequired,
        balance: React.PropTypes.number
    },

    getInitialState() {
        return {
            curIndex: 0,
            isSending: false
        }
    },

    chargeBalance() {
        if (this.state.isSending) return
        this.setState({isSending: true})
        this.props.chargeBalance(chargeOptions[this.state.curIndex].price)
            .then(res => go(res.aliPayUrl))
            .catch(err => {console.error(err)})
            .then(() => {this.setState({isSending: false})})
    },

    render() {
        var props = this.props
        return (
            <div className="balances">
                <div className="cur-balance">
                    <span>{__('Current Balance:')}</span>
                    <span className="rmb-char">{props.balance}</span>
                </div>
                <div className="charge-panel">
                    <h5>
                        <span>{__('Charge')}</span>
                        <span>{__('Get Bonus')}</span>
                        <span>{__('Will Get')}</span>
                    </h5>
                    <div className="charge-options">
                        {
                            chargeOptions.map((el, i) =>
                                <BalanceItem checked={i==this.state.curIndex} key={i} {...el} selectItem={() => this.setState({curIndex: i})}/>)
                        }
                    </div>
                    <div className="charged-balance tr">
                        <span>{__('Your Balance Will Be:')}</span>
                        <span className="rmb-char">{props.balance + chargeOptions[this.state.curIndex].price}</span>
                    </div>
                </div>
                <div className="btn-wrapper tr">
                    <span>{__('Get discounts with charging balances!')}</span>
                    <span onClick={this.chargeBalance} className={"btn" + (this.state.isSending ? " disabled" : "")}>{__('Charge Now')}</span>
                </div>
            </div>
        )
    }
})

export default BalanceCharging