"use strict";

import React from "react"
import {truthy, getValidator} from "../../utils/utils"
import StreetList from './street-list'

var EditingAddress = React.createClass({

    getInitialState() {
        return {
            error: {},
            selectedStreet: null
        }
    },

    validate(key) {
        if (!this.validate.validator) {
            this.validate.validator = getValidator((refs, key) => {
                switch (key) {
                    // fall through
                    case 'address':
                    case 'name':
                        // 返回一个对象(作为error的属性),或者将这个对象合并到error,setState
                        return {[key]: {format: refs[key].value.length < 2}}

                    case 'mobile':
                        return {mobile: {format: /1\d{10}/.test(refs.mobile.value)}}

                    // fall through
                    case 'district':
                    case 'city':
                    case 'province':
                        return {[key]: {required: !refs[key].value }}

                    case 'street':
                        return {}

                    default: return {}
                }
            })
        }
        this.setState(this.validate.validator(this.refs, key))
    },

    isError(key) {
        return truthy(this.state.error, key)
    },

    selectStreet(street) {
        this.setState({selectedStreet: street})
        this.props.toggleStreet()
    },

    streetChangeTimer: null,

    onStreetChange(e) {
        var val = e.target.value
        if (val.length < 2) return

        clearTimeout(this.streetChangeTimer)
        this.streetChangeTimer = setTimeout(() => {
            this.props.getStreet(val, this.refs.city.value || '全国')
        }, 500)
    },
    
    render() {
        var props = this.props
        var isError = this.isError
        return (
            <div className="editing-address">
                <div onClick={props.close} className="close fa fa-times"></div>
                <h5>{props._id ? '修改地址' : '添加新地址'}</h5>

                <div className="content">
                    <div className="form-field">
                        <label htmlFor="name">姓名</label>
                        <input ref="name" onBlur={() => this.validate('name')} defaultValue={props.contactPerson} type="text" id="name" placeholder="请填写您的姓名"/>

                        <div className="tips">
                            {isError('name.format') && <span className="error">姓名不能少于2个字</span>}
                        </div>
                    </div>
                    <div className="form-field error">
                        <label htmlFor="mobile">手机号</label>
                        <input type="text" ref="mobile" id="mobile" onBlur={() => this.validate('mobile')}
                               defaultValue={props.mobile} onChange={props.handleChange} placeholder="请填写您的手机号"/>

                        <div className="tips">
                            {isError('mobile.format') && <span className="error">请输入正确的手机号</span>}
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="province">省,市,区</label>

                        <div className="select-group">
                            <select ref="province" id="province" defaultValue={props.province}>
                                <option value="上海">上海市</option>
                            </select>
                            <select ref="city" defaultValue={props.city}>
                                <option value="上海">上海市</option>
                            </select>
                            <select ref="district" defaultValue={props.district}>
                                <option value="上海">上海市</option>
                            </select>
                        </div>
                        <div className="tips">
                            {isError('district.required') && <span className="error">请输入正确的信息</span>}
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="street">街道</label>
                        <input defaultValue={props.street} onChange={this.onStreetChange} onBlur={() => this.validate('street')}
                               type="text" id="street" placeholder="请填写您的街道地址"/>
                        <StreetList {...props.streetList} select={this.selectStreet}/>
                        <div className="tips">
                            {isError('street.fromSelect') && <span className="error">请输入正确的信息</span>}
                        </div>
                    </div>
                    <div className="form-field">
                        <label htmlFor="address">楼层,门牌号</label>
                        <input defaultValue={props.address} onBlur={() => this.validate('address')}
                               type="text" id="address" placeholder="请填写您的楼层,门牌号"/>
                        <div className="tips">
                            {isError('address.format') && <span className="error">不能少于2个字</span>}
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    <button>保存</button>
                    <button onClick={props.close}>取消</button>
                </div>
            </div>
        )
    }
})

export default EditingAddress