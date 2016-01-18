import {__} from '../utils/locale'

import React from 'react'
import cls from '../utils/class-name'


var TimeSelector = React.createClass({

    getInitialState() {
        return {
            showOptionPanel: false
        }
    },

    toggleOptionPanel() {
        this.setState({
            showOptionPanel: !this.state.showOptionPanel
        })
    },

    selectTime(time) {
        this.props.selectTime(time, this.props.cookingType)
        this.toggleOptionPanel()
    },
    
    render: function () {
        var props = this.props
        var cookingType = props.cookingType
        
        return (
            <div className="time-section">
                <TimeOptionPanel timeList={props.timeList} selectTime={this.selectTime} isShow={this.state.showOptionPanel}/>
                <h5 className="header">{cookingType == 'ready to cook' ? __("Choose cook delivery time") : __("Choose bento delivery time")}</h5>
                    <div className="group" onClick={this.toggleOptionPanel}>
                        {
                            props.selectedTime ?
                                (
                                    <div>
                                        <span className={cls('date', {single: !props.selectedTime.segment})}>{props.selectedTime.day}</span>
                                        {props.selectedTime.segment ? <span className="time">{props.selectedTime.segment}</span> : ''}
                                    </div>
                                ) :
                                <div>{__("Choose the delivery time")}</div>
                        }
                        <i className="fa fa-angle-down"></i>
                    </div>
            </div>
        )
    }
});

var TimeOptionPanel = React.createClass({
    render: function () {
        var props = this.props

        return (
            <div className="time-option-panel" style={{display: props.isShow ? 'block' : 'none'}}>
                <h5>{__("Choose the delivery time")}</h5>
                <ul>
                    {
                        props.timeList.map((time, i) =>
                            <li key={i} onClick={() => props.selectTime(time)}>{time.day + ' ' + time.segment}</li>)
                    }
                </ul>
            </div>
        )
    }
})

export default TimeSelector;