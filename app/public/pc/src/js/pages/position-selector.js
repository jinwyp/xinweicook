import {init as initCommon} from './common' //no react. for html header
import {__} from '../utils/locale'

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import Modal from 'react-modal'
import configurePositionStore from '../stores/configurePositionStore'

import * as addressAction from "../actions/address"
import * as positionAction from "../actions/position-selector"

import AddressList from "../components/address/address-list"

import {emitter} from './common'

var modalStyle = {
    overlay: {
      backgroundColor              : 'transparent'
    },
    content: {
        position                   : 'absolute',
        top                        : '250px',
        left                       : '0',
        right                      : '0',
        bottom                     : 'auto',
        border                     : 'none',
        width                      : '583px',
        height                     : 'auto',
        background                 : '#fff',
        maxHeight                  : '275px',
        overflow                   : 'visible',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '0',
        outline                    : 'none',
        padding                    : '0',
        margin                     : 'auto',
        boxShadow                  : '0 0 60px #969696'
    }
}

var modalAnnounceStyle = {
    content: {
        position                   : 'absolute',
        top                        : '0',
        left                       : '0',
        right                      : '0',
        bottom                     : '0',
        border                     : 'none',
        width                      : '470px',
        height                     : '177px',
        background                 : '#fff',
        overflow                   : 'visible',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '0',
        outline                    : 'none',
        padding                    : '0',
        margin                     : 'auto'
    }
}

var App = React.createClass({
    getInitialState() {
        return {
            shakeButton: false,
            showAnnounce: Date.now() > new Date('Fri Mar 21 2016 00:00:00 GMT+0800 (CST)')
        }
    },

    componentDidMount: function () {
        emitter.on(emitter.t.noAddressAlert, () => {
            this.setState({
                shakeButton: true
            })
            setTimeout(() => {
                this.setState({
                    shakeButton: false
                })
            }, 1000)
        })
        if (localStorage.access_token) {
            this.props.dispatch(addressAction.getList())
        }
    },

    componentDidUpdate(prevProps) {
        // 当获取了地址,并且地址为空的数组的时候,弹出需要填地址的框.
        var newAddresses = this.props.address.addresses
        if (!prevProps.address.addresses && newAddresses && !newAddresses.length) {
            this.methods.show()
            this.methods.addressList.addOne()
        }

        // 如果addressId变了,那么就该检查warehouse有没有变,
        // 如果也变了,那么就该更新便当的可购买性(暂时是非react的)
        var oldAddressId = prevProps.positionSelector.addressId
        var newAddressId = this.props.positionSelector.addressId
        var oldAddress, newAddress
        if (oldAddressId != newAddressId) {
            oldAddress = (prevProps.address.addresses || []).filter(
                    el => el._id == oldAddressId)[0]
            newAddress = this.props.address.addresses.filter(
                    el => el._id == newAddressId
            )[0]
            emitter.emit(emitter.t.positionChanged, newAddress, oldAddress)
        }

        // 如果新地址不是默认地址,那么设置它为默认地址,并保存
        if (newAddress && !newAddress.isDefault) {
            // action中会自动设置isDefault为true
            this.methods.addressList.putOne(newAddress)
        }
    },
    close() {
        this.setState({showAnnounce: false})
    },

    methods: {},
    render: function () {
        const {dispatch, address, positionSelector} = this.props

        if (!this.methods.addressList) {
            this.methods.addressList = {
                addOne: ()=>dispatch(addressAction.editAddress()),
                putOne: address => dispatch(addressAction.putOne(address)), // useless for now
                postOne: address => dispatch(addressAction.postOne(address)),
                toggleStreet: (show) => dispatch(addressAction.toggleStreet(show)),
                getStreet: (query, region) => dispatch(addressAction.getStreet(query, region)),
                clearStreet: () => dispatch(addressAction.clearStreet()),
                getRange: () => dispatch(addressAction.getRangeIfNeeded()),
                select: (id, _address) => dispatch(addressAction.select(id, _address)),
                close: () => {
                    dispatch(addressAction.closeEditAddress())
                    if (!this.props.address.addresses.length) {
                        this.methods.close()
                    }
                }
            }

            this.methods.show = () => dispatch(positionAction.toggleSelector(true))
            this.methods.close = () => dispatch(positionAction.toggleSelector(false))
            this.methods.changePosition = () => {
                if (!localStorage.access_token || !this.props.address.addresses) {
                    location.href = __PCPREFIX__ + '/sign?redirect=' + location.pathname
                    return
                }
                this.methods.show()
                if (!this.props.address.addresses.length) {
                    this.methods.addressList.addOne()
                }
            }
        }

        var id = positionSelector.addressId,
            curPosition = __('Unknown'),
            hideAddressList = address.addresses && !address.addresses.length
        if (id) {
            curPosition = address.addresses.filter(el => el._id == id)[0].street
        }

        return (
            <div>
                <div className="cur-position">
                    <span className="label">{__('Location')}:</span>
                    <span className="address">{curPosition}</span>
                    <span onClick={this.methods.changePosition} className={`change-address ${this.state.shakeButton ? 'shake': ''}`}>[{__('Change address')}]</span>
                </div>
                <Modal style={modalStyle} isOpen={positionSelector.showSelector} onRequestClose={this.methods.close} closeTimeoutMS={250}>
                    <AddressList hideList={hideAddressList} title={__('Please choose an address')} {...this.methods.addressList} {...address} className='position-selector'/>
                </Modal>
                <Modal style={modalAnnounceStyle} isOpen={this.state.showAnnounce} onRequestClose={this.close} closeTimeoutMS={250}>
                    <div className="farewell-announce">
                        <span className="close fa fa-times" onClick={this.close}/>
                        <h5>亲爱的新味用户:</h5>
                        <p>为了给广大消费者提供更好的产品和服务，新味将进行业务全面升级，即日起暂停营业，会尽快回归。给您带来的不便，我们表示深深的歉意！希望升级后的新味能得到您一如既往的喜爱与支持！</p>
                        <p className="tr">新味<br/>
                            2016年3月21日
                        </p>
                    </div>
                </Modal>
            </div>
        );
    }
});

var WrappedApp = connect(state => state)(App)

var store = configurePositionStore()

var rootElement = document.getElementById('react-root')

ReactDom.render(
    <Provider store={store}><WrappedApp/></Provider>,
    rootElement
)

