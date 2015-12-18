import React from 'react'

var StaticAddress = React.createClass({

    _select() {
        var props = this.props
        !props.outOfRange && props.select(props._id, {
            isAvailableForEat: props.isAvailableForEat,
            warehouse: props.warehouse,
            city: props.city,
            _id: props._id
        })
    },

    render: function () {
        var props = this.props
        return (
            <div className={"address" + (props.outOfRange ? ' out-of-range' : '')} onClick={this._select}>
                <div className="content-wrapper">
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
                <div className="out-of-range" style={{display: props.outOfRange ? 'block' : 'none'}}>该地址不在便当配送范围内</div>
            </div>
        )
    }
});

export default StaticAddress;