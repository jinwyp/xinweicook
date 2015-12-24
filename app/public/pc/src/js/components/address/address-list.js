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

    render: function () {
        var props = this.props
        var title = props.title || '配送至'
        const editingAddress = props.addresses.filter(address => address._id == props.addressEditingForm.id)[0] || {}
        return (
            <div className="address-section">
                <h5 className="header">
                    <span>{title}</span>
                    <span className="add-address" onClick={props.addOne}><i className="square-icon">+</i> 添加地址</span>
                    <Modal style={modalStyle} isOpen={props.addressEditingForm.show} onRequestClose={props.close} closeTimeoutMS={250}>
                        <EditingAddress range={props.range} streetList={props.streetList}
                                        {...editingAddress} postOne={props.postOne}
                                        close={props.close} getStreet={props.getStreet}
                                        toggleStreet={props.toggleStreet} getRange={props.getRange}/>
                    </Modal>
                </h5>
                <ul className="address-list">
                    {
                        props.addresses.map( address =>
                                <li key={address._id}><StaticAddress {...address} select={props.select}/></li>
                        )
                    }
                </ul>
            </div>
        )
    }
});

export default AddressList;