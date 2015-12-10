import React from 'react'
import StaticAddress from './static-address'

var AddressList = React.createClass({

    render: function () {
        var props = this.props
        var title = props.title || '配送至'
        return (
            <div className="address-section">
                <h5 className="header">
                    <span>{title}</span>
                    <span className="add-address" onClick={props.addOne}><i className="fa fa-plus-square-o"></i> 添加地址</span>
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