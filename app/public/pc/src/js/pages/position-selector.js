import {init as initCommon} from './common' //no react. for html header

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import Modal from 'react-modal'
import configurePositionStore from '../stores/configurePositionStore'

import * as addressAction from "../actions/address"
import * as positionAction from "../actions/address"

import AddressList from "../components/address/address-list"

var App = React.createClass({
    componentDidMount: function () {
        if (localStorage.access_token ) {
            this.props.dispatch(addressAction.getList())
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
                close: () => dispatch(addressAction.closeEditAddress()),
                toggleStreet: (show) => dispatch(addressAction.toggleStreet(show)),
                getStreet: (query, region) => dispatch(addressAction.getStreet(query, region)),
                getRange: () => dispatch(addressAction.getRangeIfNeeded()),
                select: (id, _address) => {
                    dispatch(addressAction.select(id, _address))
                }
            }

            this.methods.position = {
                changePosition:() => dispatch(positionAction.toggleSelector(true)),
                close:()=>dispatch(positionAction.toggleSelector(false))
            }
        }

        return (
            <div className="position-selector">
                <div className="cur-position">
                    <span className="label">当前位置:</span>
                    <span className="address">东方明珠</span>
                    <span onClick={this.methods.position.changePosition} className="change-address">[切换地址]</span>
                </div>
                <Modal style={modalStyle} isOpen={props.positionSelector.showSelector} onRequestClose={props.close} closeTimeoutMS={250}>
                    <AddressList title='请选择地址' showNewIfNoAddress={true} {...address}/>
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

