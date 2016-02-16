import React from 'react'
import {__} from '../utils/locale'

import errCode from '../../../../../libs/errcode'
import errInfo from '../constants/ErrInfo'

var wrongMobile = errCode.user.wrongMobile
var alreadyExist = errCode.user.alreadyExist
var wrongCode = errCode.sms.wrongCode
var expired = errCode.sms.expired
var invalidCode = errCode.sms.invalidCode

var SignUp = React.createClass({

    getInitialState: function () {
        var state = {
            isSending: false
        }

        // async validation states,
        // should be reset after blurred(assuming it be changed)
        state[wrongMobile] = false
        state[alreadyExist] = false
        state[wrongCode] = false
        state[expired] = false
        state[invalidCode] = false

        ;['mobile', 'smsCode', 'pwd', 'rePwd']
            .forEach(key => state[key + 'ValidateOn'] = false);
        return state;
    },

    onSubmit: function (e) {
        e.preventDefault();
        this.setState({
            mobileValidateOn: true,
            smsCodeValidateOn: true,
            pwdValidateOn: true,
            rePwdValidateOn: true
        })
        if (['mobile', 'smsCode', 'pwd', 'rePwd'].every(t=>this.validate(t))) {
            this.setState({
                isSending: true
            });
            this.props.signUp({
                mobile: this.refs.mobile.value,
                smsCode: this.refs.smsCode.value,
                pwd: this.refs.pwd.value
            })
            .then(()=>location.href = __PCPREFIX__ + '/')
            .catch(res => res.then(data => data.validationStatus &&
                this.setState({[data.validationStatus]: true})))
            .then(()=>{this.setState({isSending: false})})
        }

    },

    onBlur (name) {
        var state = {
            [name + 'ValidateOn']: true
        }

        // for async validation
        if (name == 'mobile') {
            state[wrongMobile] = false
            state[alreadyExist] = false
        } else if (name == 'smsCode') {
            state[wrongCode] = false
            state[expired] = false
            state[invalidCode] = false
        }

        this.setState(state)
    },


    validate: function (type) {
        switch (type) {
            case 'mobile':
                return /^1\d{10}$/.test(this.refs.mobile.value)
            case 'smsCode':
                return /^\w{6}$/.test(this.refs.smsCode.value)
            case 'pwd':
                return /^\w{6,}$/.test(this.refs.pwd.value)
            case 'rePwd':
                return this.refs.pwd.value == this.refs.rePwd.value

            default: return false
        }
    },

    _mobileChange: function () {
        var mobile = this.refs.mobile.value;
        if (mobile) {
            localStorage.mobile = mobile;
        }
    },

    render: function () {
        return (
            <div className="signup">
                <h6 className="title">{__('Sign up')}</h6>
                <form onSubmit={this.onSubmit}>
                    <label className="lab">{__('Mobile number')}</label>
                    <div className="form-control-group">
                        <input ref="mobile" defaultValue={this.props.mobile} onChange={this._mobileChange} onBlur={()=>this.onBlur('mobile')} id="signup_tel" type="text"/>
                        { this.state.mobileValidateOn && !this.validate('mobile') && <span className="err-tip">{__('Please enter the 11 digits mobile number')}</span>}
                        {this.state[wrongMobile] && <span className="err-tip">{__(errInfo[wrongMobile])}</span>}
                        {this.state[alreadyExist] && <span className="err-tip">{__(errInfo[alreadyExist])}</span>}
                    </div>

                    <label className="lab" id="sms-code" style={{marginTop: 87}}>{__('Verification code')}</label>
                    <div className="form-control-group">
                        <input ref="smsCode" defaultValue={this.props.smsCode} onBlur={()=>this.onBlur('smsCode')} id="signup_code" type="text"/>
                        {this.state.smsCodeValidateOn && !this.validate('smsCode') && <span className="err-tip">{__("Please enter the 6 digits verification code")}</span>}
                        {this.state[wrongCode] && <span className="err-tip">{__(errInfo[wrongMobile])}</span>}
                        {this.state[invalidCode] && <span className="err-tip">{__(errInfo[invalidCode])}</span>}
                        {this.state[expired] && <span className="err-tip">{__(errInfo[expired])}</span>}
                    </div>

                    <label className="lab">{__('Enter your password')}</label>
                    <div className="form-control-group">
                        <input ref="pwd" defaultValue={this.props.pwd} onBlur={()=>this.setState({pwdValidateOn: true})} id="signup_pwd" type="password"/>
                        {this.state.pwdValidateOn && !this.validate('pwd') && <span className="err-tip">{__('Your password must be at least 6 characters long')}</span>}
                    </div>

                    <label className="lab">{__('Confirm your password')}</label>
                    <div className="form-control-group">
                        <input ref="rePwd" onBlur={()=>this.setState({rePwdValidateOn: true})} id="signup_repwd" type="password"/>
                        {this.state.rePwdValidateOn && !this.validate('rePwd') && <span className="err-tip">{__('The two passwords are different')}</span>}
                    </div>
                    {
                        this.state.isSending ?
                            <button id="signup_btn" disabled className="btn-login">{__("Signing up")}···</button>:
                            <button id="signup_btn" className="btn-login">{__("Sign up")}</button>
                    }
                </form>
            </div>
        )
    }
});

export default SignUp;