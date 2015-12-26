"use strict";

import React from 'react'

var StreetList = React.createClass({

    render: function () {
        var props = this.props
        if (!props.show) return null
        return (
            <ul className="street-list">
                {
                    props.streets.map((street, i) =>
                        <li key={street.lat + i} onClick={(e) => {e.stopPropagation();props.select(street)}}>
                            <div className="name">{street.address}</div>
                            <div className="address">{street.addressInfoBaidu}</div>
                        </li>
                    )
                }
            </ul>
        )
    }
});

export default StreetList;