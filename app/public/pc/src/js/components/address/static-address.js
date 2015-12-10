import React from 'react'

var StaticAddress = React.createClass({

    render: function () {
        var props = this.props
        return (
            <div className="address" onClick={() => props.select(props._id, props.warehouse)}>
                <span  className={'fa ' + (props.selected ? 'fa-dot-circle-o' : 'fa-circle-o')}></span>
                <span>{props.contactPerson}</span>
                <div className="address-detail">
                    <div className="table">
                        <div className="cell">
                            <span>{props.province}</span>
                            <span>{props.city}</span>
                            <span>{props.district}</span>
                            <span>{props.street}</span>
                            <span>{props.address}</span>
                        </div>
                    </div>
                </div>
                <span>{props.mobile}</span>
            </div>
        )
    }
});

export default StaticAddress;