import React from 'react'

var SignUp = React.createClass({

    getInitialState: function () {
        var state = {
            isSending: false
        };
        ['mobile', 'smsCode', 'pwd', 'rePwd']
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
            }).catch(()=>{}).then(()=>{this.setState({isSending: false})})
        }

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

    render: function () {
        return (
            <div className="signup">
                <h6 className="title">注册</h6>
                <form onSubmit={this.onSubmit}>
                    <label className="lab">手机号</label>
                    <div className="form-control-group">
                        <input ref="mobile" defaultValue={this.props.mobile} onBlur={()=>this.setState({mobileValidateOn: true})} id="signup_tel" type="text"/>
                        { this.state.mobileValidateOn && !this.validate('mobile') && <span className="err-tip">请填写11位手机号码</span>}
                    </div>

                    <label className="lab">验证码</label>
                    <div className="form-control-group">
                        <input ref="smsCode" defaultValue={this.props.smsCode} onBlur={()=>this.setState({smsCodeValidateOn: true})} id="signup_code" type="text" style={{width: 50 + '%'}}/>
                        {this.state.smsCodeValidateOn && !this.validate('smsCode') && <span className="err-tip">请填写6位验证码</span>}
                    </div>

                    <span id="signup_code_btn" style={{cursor:'pointer'}} className="getcode">获取验证码</span>
                    <label className="lab">设置密码</label>
                    <div className="form-control-group">
                        <input ref="pwd" defaultValue={this.props.pwd} onBlur={()=>this.setState({pwdValidateOn: true})} id="signup_pwd" type="password"/>
                        {this.state.pwdValidateOn && !this.validate('pwd') && <span className="err-tip">密码至少为6位</span>}
                    </div>

                    <label className="lab">确认密码</label>
                    <div className="form-control-group">
                        <input ref="rePwd" onBlur={()=>this.setState({rePwdValidateOn: true})} id="signup_repwd" type="password"/>
                        {this.state.rePwdValidateOn && !this.validate('rePwd') && <span className="err-tip">两次输入的密码不一致</span>}
                    </div>
                    {
                        this.state.isSending ?
                            <button id="signup_btn" disabled className="btn-login">注册中···</button>:
                            <button id="signup_btn" className="btn-login">注册</button>
                    }
                </form>
            </div>
        )
    }
});

export default SignUp;