import React from 'react'
import {search} from '../utils/utils'

var SignIn = React.createClass({

    getInitialState: function () {
        var state = {
            isSending: false
        };
        ['mobile', 'pwd']
            .forEach(key => state[key + 'ValidateOn'] = false);
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
            .catch(()=>alert('Sign in failed, try it later'))
            .then(()=>{this.setState({isSending: false})})
        }

    },

    validate: function (type) {
        switch (type) {
            case 'mobile':
                return /^1\d{10}$/.test(this.refs.mobile.value)
            case 'pwd':
                return /^\w{6,}$/.test(this.refs.pwd.value)

            default: return false
        }
    },

    render: function () {
        return (
            <div className="signup">
                <h6 className="title">登录</h6>
                <form onSubmit={this.onSubmit}>
                    <label htmlFor="signin_tel" className="lab">手机号</label>
                    <div className="form-control-group">
                        <input ref="mobile" defaultValue={this.props.mobile} onBlur={()=>this.setState({mobileValidateOn: true})} id="signip_tel" type="text"/>
                        { this.state.mobileValidateOn && !this.validate('mobile') && <span className="err-tip">请填写11位手机号码</span>}
                    </div>

                    <label htmlFor="signin_pwd" className="lab">密码</label>
                    <div className="form-control-group">
                        <input ref="pwd" defaultValue={this.props.pwd} onBlur={()=>this.setState({pwdValidateOn: true})} id="signin_pwd" type="password"/>
                        {this.state.pwdValidateOn && !this.validate('pwd') && <span className="err-tip">密码至少为6位</span>}
                    </div>
                    <a id="resetpwd" className="forgot" style={{display: 'none'}}>忘记密码了?</a>

                    {
                        this.state.isSending ?
                            <button id="signin_btn" disabled className="btn-login">登录中···</button>:
                            <button id="signin_btn" className="btn-login">登录</button>
                    }
                </form>
            </div>
        )
    }
});

export default SignIn;