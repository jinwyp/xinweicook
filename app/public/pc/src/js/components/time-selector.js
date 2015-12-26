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
                <h5 className="header">{cookingType == 'ready to cook' ? '选择食材包配送时间' : '选择便当配送时间'}</h5>
                    <div className="group" onClick={this.toggleOptionPanel}>
                        {
                            props.selectedTime ?
                                (
                                    <div>
                                        <span className={cls('date', {single: !props.selectedTime.segment})}>{props.selectedTime.day}</span>
                                        {props.selectedTime.segment ? <span className="time">{props.selectedTime.segment}</span> : ''}
                                    </div>
                                ) :
                                <div>请选择配送时间</div>
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
                <h5>选择配送时间</h5>
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