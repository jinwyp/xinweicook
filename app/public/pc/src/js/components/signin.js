import React from 'react'
import {search} from '../utils/utils'
import {__} from '../utils/locale'

import errCode from '../../../../../libs/errcode'
import errInfo from '../constants/ErrInfo'

var wrongMobile = errCode.user.wrongMobile
var wrongPassword = errCode.user.wrongPassword
var alreadyExist = errCode.user.alreadyExist
var notFound = errCode.user.notFound

var SignIn = React.createClass({

    getInitialState: function () {
        var state = {
            isSending: false
        }

        // async validation states,
        // should be reset after blurred(assuming it be changed)
        state[wrongMobile] = false
        state[wrongPassword] = false
        state[alreadyExist] = false
        state[notFound] = false;

        ['mobile', 'pwd']
            .forEach(key => state[key + 'ValidateOn'] = false)
        return state;
    },

    onSubmit: function (e) {
        e.preventDefault();
        this.setState({
            mobileValidateOn: true,
            pwdValidateOn: true
        })
        if (['mobile', 'pwd'].every(t=>this.validate(t))) {
            this.setState({
                isSending: true
            });
            this.props.signIn({
                mobile: this.refs.mobile.value,
                pwd: this.refs.pwd.value
            })
            .then(()=>location.href = search().redirect || __PCPREFIX__ + '/')
            .catch(res => res.then(data => data.validationStatus &&
                this.setState({[data.validationStatus]: true})))
            .then(()=>{this.setState({isSending: false})})
        }

    },

    onBlur (name) {
        var state = {
            [name + 'ValidateOn']: true
        }
        if (name == 'mobile') {
            state[wrongMobile] = false
            state[alreadyExist] = false
            state[notFound] = false
        } else if (name == 'pwd') {
            state[wrongPassword] = false
        }
        this.setState(state)
    },

    validate: function (type) {
        switch (type) {
            case 'mobile':
                return /^1\d{10}$/.test(this.refs.mobile.value)
            case 'pwd':
                return /^[\w~]{6,}$/.test(this.refs.pwd.value)

            default: return false
        }
    },

    render: function () {
        return (
            <div className="signup">
                <h6 className="title">{__('Sign in')}</h6>
                <form onSubmit={this.onSubmit}>
                    <label htmlFor="signin_tel" className="lab">{__('Mobile number')}</label>
                    <div className="form-control-group">
                        <input ref="mobile" defaultValue={this.props.mobile} onBlur={()=>this.onBlur('mobile')} id="signip_tel" type="text"/>
                        { this.state.mobileValidateOn && !this.validate('mobile') && <span className="err-tip">{__('Please enter the 11 digits mobile number')}</span>}
                        {this.state[wrongMobile] && <span className="err-tip">{__(errInfo[ wrongMobile])}</span>}
                        {this.state[notFound] && <span className="err-tip">{__(errInfo[notFound])}</span>}
                        {this.state[alreadyExist] && <span className="err-tip">{__(errInfo[alreadyExist])}</span>}
                    </div>

                    <label htmlFor="signin_pwd" className="lab">{__('Password')}</label>
                    <div className="form-control-group">
                        <input ref="pwd" defaultValue={this.props.pwd} onBlur={()=>this.onBlur('pwd')} id="signin_pwd" type="password"/>
                        {this.state.pwdValidateOn && !this.validate('pwd') && <span className="err-tip">{__('Your password must be at least 6 characters long')}</span>}
                        {this.state[wrongPassword] && <span className="err-tip">{__(errInfo[wrongPassword])}</span>}
                    </div>
                    <a id="resetpwd" className="forgot" href={__PCPREFIX__ + '/resetpwd'}>{__('Forgot your password?')}</a>

                    {
                        this.state.isSending ?
                            <button id="signin_btn" disabled className="btn-login">{__('Signing in')}</button>:
                            <button id="signin_btn" className="btn-login">{__('Sign in')}</button>
                    }
                </form>
            </div>
        )
    }
});

export default SignIn;