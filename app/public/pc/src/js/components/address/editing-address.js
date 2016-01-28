"use strict";

import {__} from '../../utils/locale'

import React from "react"
import {truthy, getValidator, log} from "../../utils/utils"
import StreetList from './street-list'

var EditingAddress = React.createClass({

    componentDidMount() {
        this.props.getRange()
        this.props.clearStreet()
    },

    getInitialState() {
        return {
            error: {},
            selectedStreet: null,
            province: this.props.province || '',
            city: this.props.city || '',
            district: this.props.district || '',
            saving: false
        }
    },

    /**
     * 如果指定key,则验证refs中的相应值,如果没有则验证所有值
     * @return {boolean} - true 表示有错, false 表示无错
     */
    validate(key) {
        if (!this.validate.validator) {
            this.validate.validator = getValidator((refs, key) => {
                // 返回的value值为true就表示验证失败
                switch (key) {
                    // fall through
                    case 'address':
                    case 'contactPerson':
                        // 返回一个对象(作为error的属性),或者将这个对象合并到error,setState
                        return {[key]: {format: refs[key].value.length < 2}}

                    case 'mobile':
                        return {mobile: {format: !/^1\d{10}$/.test(refs.mobile.value)}}

                    // fall through
                    case 'district':
                    case 'city':
                    case 'province':
                        return {district: {required: !refs.district.value }}

                    case 'street':
                        return {street: {
                            format: !this.state.selectedStreet && !this.props.geoLatitude
                        }}

                    default: return {}
                }
            })
        }

        var error = this.validate.validator(this.refs, key)
        this.setState({error: Object.assign({}, this.state.error, error)})
        return !Object.keys(error).some(key =>
            Object.keys(error[key]).some(el => error[key][el]))
    },

    isError(key) {
        return truthy(this.state.error, key)
    },

    selectStreet(street) {
        this.setState({selectedStreet: street}, () => this.validate('street'))
        // change dom. Not elegant but simple, simple is beautiful
        this.refs.street.value = street.address
        this.onStreetChange.ignore = true
        this.props.toggleStreet()
    },

    streetChangeTimer: null,

    onStreetChange(e) {
        if (this.onStreetChange.ignore) {
            this.onStreetChange.ignore = false
            return
        }
        var val = e.target.value
        if (val.length < 2) return

        this.setState({selectedStreet: null})
        this.getStreetList(val)
    },

    onStreetClick(e) {
        e.stopPropagation()
        var val = e.target.value
        if ((val.length < 2)) return

        this.getStreetList(val)
    },

    getStreetList(val) {
        clearTimeout(this.streetChangeTimer)
        this.streetChangeTimer = setTimeout(() => {
            this.props.getStreet(val, this.refs.city.value || '全国')
        }, 500)
    },

    onStreetHideClick() {
        this.props.toggleStreet(false)
    },

    onChangeSelect(e, type) {
        var value = e.target.value || ''
        if (type == 'district') {
            this.setState({district: value})
        }
        if (type == 'city') {
            this.setState({city: value, district: ''})
        }
        if (type == 'province') {
            this.setState({province: value, city: '', district: ''})
        }
    },

    save() {
        if (!this.validate()) return

        var props = this.props
        var sLat = this.state.selectedStreet && this.state.selectedStreet.lat
        var sLng = this.state.selectedStreet && this.state.selectedStreet.lng
        var method, target = {
            geoLatitude: sLat || this.props.geoLatitude,
            geoLongitude: sLng || this.props.geoLongitude
        }

        if (props._id) {
            method = 'putOne'
            target._id = props._id
            target.sortOrder = props.sortOrder
        } else {
            method = 'postOne'
            target.sortOrder = 0
        }

        this.props[method](Object.assign(target,
            Object.keys(this.refs).reduce((obj, key) => {
                obj[key] = this.refs[key].value
                return obj
            }, {})
        )).catch(err => log(err))

        this.setState({saving: true})
    },

    render() {
        var props = this.props
        var range = this.props.range;
        var isError = this.isError
        var emptyOption = <option key="#" value="">{__('Choose')}</option>

        // range 未加载好,如果是在编辑状态,使用编辑状态的地址构造临时的range
        if (!range.length && props._id) {
            range = [
                {
                    state: props.province,
                    cities: [
                        {
                            city: props.city,
                            areas: [props.district]
                        }
                    ]
                }
            ]
        }

        var provinceOptions = range.map((province, i) => <option key={i} value={province.state}>{province.state}</option>)
        provinceOptions.unshift(emptyOption)

        var cities = !this.state.province ? [] : range.filter(p => p.state == this.state.province)[0].cities
        var cityOptions = cities.map((city) => <option key={city.city} value={city.city}>{city.city}</option>)
        cityOptions.unshift(emptyOption)

        var districts = (!this.state.province || !this.state.city) ? [] :
            range.filter(p => p.state == this.state.province)[0].cities.filter(c => c.city == this.state.city)[0].areas
        var districtOptions = districts.map((district) => <option key={district} value={district}>{district}</option>)
        districtOptions.unshift(emptyOption)

        return (
            <div className="editing-address" onClick={this.onStreetHideClick}>
                <div onClick={props.close} className="close fa fa-times"></div>
                <h5>{props._id ? __('Edit Address') : __('Add a new address')}</h5>

                <div className="content">
                    <div className={'form-field' + (isError('contactPerson.format') ? ' error' : '')}>
                        <label htmlFor="contactPerson">{__('Name')}</label>
                        <input ref="contactPerson" onBlur={() => this.validate('contactPerson')}
                               defaultValue={props.contactPerson} type="text" id="contactPerson" placeholder={__('Please enter your name')}/>

                        <div className="tips">
                            {isError('contactPerson.format') && <span className="error">{__('Your name must be at least 2 characters long')}</span>}
                        </div>
                    </div>
                    <div className={'form-field' + (isError('mobile.format') ? ' error' : '')}>
                        <label htmlFor="mobile">{__('Mobile number')}</label>
                        <input type="text" ref="mobile" id="mobile" onBlur={() => this.validate('mobile')}
                               defaultValue={props.mobile} onChange={props.handleChange} placeholder={__('Mobile number')}/>

                        <div className="tips">
                            {isError('mobile.format') && <span className="error">{__('Please enter the 11 digits mobile number')}</span>}
                        </div>
                    </div>
                    <div className={'form-field' + (isError('district.required') ? ' error' : '')}>
                        <label htmlFor="province">{__('Province, City, District')}</label>

                        <div className="select-group">
                            <select ref="province" id="province" value={this.state.province} onChange={e => this.onChangeSelect(e, 'province')}>
                                {provinceOptions}
                            </select>
                            <select ref="city" value={this.state.city} onChange={e => this.onChangeSelect(e, 'city')}>
                                {cityOptions}
                            </select>
                            <select ref="district" value={this.state.district} onChange={e => this.onChangeSelect(e, 'district')}>
                                {districtOptions}
                            </select>
                        </div>
                        <div className="tips">
                            {isError('district.required') && <span className="error">{__('Please choose a district')}</span>}
                        </div>
                    </div>
                    <div className={'form-field' + (isError('street.format') ? ' error' : '')}>
                        <label htmlFor="street">{__('Street')}</label>
                        <input ref="street" defaultValue={props.street} onClick={this.onStreetClick}
                               onChange={this.onStreetChange} onBlur={() => this.validate('street')}
                               type="text" id="street" placeholder={__('Please enter your street')}/>
                        <StreetList {...props.streetList} select={this.selectStreet}/>
                        <div className="tips">
                            {isError('street.format') && <span className="error">{__('Please enter your location information')}</span>}
                        </div>
                    </div>
                    <div className={'form-field' + (isError('address.format') ? ' error' : '')}>
                        <label htmlFor="address">{__("Street, house number")}</label>
                        <input defaultValue={props.address} onBlur={() => this.validate('address')}
                               type="text" id="address" placeholder={__("Street, house number required")} ref="address"/>
                        <div className="tips">
                            {isError('address.format') && <span className="error">{__("At least 2 characters")}</span>}
                        </div>
                    </div>
                </div>
                <div className="buttons">
                    {
                        this.state.saving ?
                            <button className="saving">{__("Saving")}</button> :
                            <button onClick={this.save}>{__("Save")}</button>
                    }
                    <button onClick={props.close}>{__("Cancel")}</button>
                </div>
            </div>
        )
    }
})

export default EditingAddress