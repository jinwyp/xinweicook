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

var App = React.createClass({
    componentDidMount: function () {
        if (localStorage.access_token ) {
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
                if (!localStorage.access_token) {
                    location.href = __PCPREFIX__ + '/sign?redirect=' + location.pathname
                    return
                }
                if (this.props.address.addresses) {
                    this.methods.show()
                    if (!this.props.address.addresses.length) {
                        this.methods.addressList.addOne()
                    }
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
                    <span onClick={this.methods.changePosition} className="change-address">[{__('Change address')}]</span>
                </div>
                <Modal style={modalStyle} isOpen={positionSelector.showSelector} onRequestClose={this.methods.close} closeTimeoutMS={250}>
                    <AddressList hideList={hideAddressList} title={__('Please choose an address')} {...this.methods.addressList} {...address} className='position-selector'/>
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

