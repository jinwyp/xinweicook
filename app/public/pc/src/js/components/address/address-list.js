import {__} from '../../utils/locale'

import React from 'react'
import StaticAddress from './static-address'
import EditingAddress from './editing-address'
import Modal from 'react-modal'

var modalStyle = {
    content: {
        position                   : 'absolute',
        top                        : '0',
        left                       : '0',
        right                      : '0',
        bottom                     : '0',
        border                     : 'none',
        width                      : '470px',
        height                     : '461px',
        background                 : '#fff',
        overflow                   : 'visible',
        WebkitOverflowScrolling    : 'touch',
        borderRadius               : '0',
        outline                    : 'none',
        padding                    : '0',
        margin                     : 'auto'
    }
}

var AddressList = React.createClass({

    componentDidMount() {
        this.props.getList && this.props.getList()
    },

    render: function () {
        var props = this.props
        var title = props.title || __('Deliver to')
        var addresses = props.addresses || []
        const editingAddress = addresses.filter(address => address._id == props.addressEditingForm.id)[0] || {}
        return (
            <div style={{display: (props.hideList ? 'none' : 'block')}} className={`address-section ${props.className || ''}`}>
                <h5 className="header">
                    <span>{title}</span>
                    <span className="add-address" onClick={props.addOne}><i className="square-icon">+</i> {__('Add a new address')}</span>
                </h5>
                <Modal style={modalStyle} isOpen={props.addressEditingForm.show} onRequestClose={props.close} closeTimeoutMS={250}>
                    <EditingAddress range={props.range} streetList={props.streetList}
                        {...editingAddress} postOne={props.postOne} putOne={props.putOne}
                                    close={props.close} getStreet={props.getStreet} clearStreet={props.clearStreet}
                                    toggleStreet={props.toggleStreet} getRange={props.getRange}/>
                </Modal>
                <ul className="address-list">
                    {
                        addresses.map( address =>
                                <li key={address._id}>
                                    <StaticAddress delOne={props.delOne}
                                                   modifyOne={props.modifyOne}
                                                   hideRadio={props.hideRadio || false} {...address}
                                                   select={props.select}/>
                                </li>
                        )
                    }
                </ul>
            </div>
        )
    }
});

export default AddressList;