import React from 'react'
import className from '../utils/class-name'


var TimeSelector = React.createClass({
    
    render: function () {
        var props = this.props
        var cookingType = props.cookingType;
        var timeOptions;
        if (cookingType == 'ready to cook') {
            timeOptions = []
            props.timeList.forEach(time => {

            })
        }
        
        return (
            <div className="time-section">
                <h5 className="header">{cookingType == 'ready to cook' ? '选择食材包配送时间' : '选择便当配送时间'}</h5>
                {
                    cookingType == 'ready to cook' ?
                        (
                            <div className="group">
                                <span className={className('date', {single: !time.segment})}>{time.day}</span>
                                {time.segment ? <span className="time">{time.segment}</span> : ''}
                                <i className="fa fa-angle-down"></i>
                            </div>
                        ) :
                        (
                            <div className="group">
                                <span className="date">{time.day}</span>
                                <span className="time">{time.segment}</span>
                                <i className="fa fa-angle-down"></i>
                            </div>
                        )
                }
            </div>
        )
    }
});

var TimeOptionPanel = React.createClass({
    render: function () {
        var props = this.props

        return (
            <div className="time-option-panel">
                <h5>选择配送时间</h5>
                <ul>
                    {
                        props.timeOptions.map((time, i) =>
                            <li key={i}>{time.day + ' ' + time.segment}</li>)
                    }
                </ul>
            </div>
        )
    }
})

export default TimeSelector;