import React from 'react'

var SignUp = React.createClass({

    getInitialState: function () {
        var state = {
            mobile: this.props.mobile,
            smsCode: this.props.smsCode,
            pwd: this.props.pwd,
            rePwd: this.props.rePwd
        };

        Object.keys(state).forEach(key => state[key + 'ValidateOn'] = false);
        return state;
    },

    render: function () {
        return (
            <div className="signup">
                <h6 className="title">注册</h6>
                <label className="lab">手机号</label>
                <div className="form-control-group">
                    <input ref="mobile" defaultValue={this.state.mobile} onBlur={()=>this.setState({mobileValidateOn: true})} id="signup_tel" type="text"/>
                    {()=>{
                        console.log(this.state.mobileValidateOn);
                        console.log(!/^1\d{10}$/.test(this.refs.mobile.value));
                        if (this.state.mobileValidateOn && !/^1\d{10}$/.test(this.refs.mobile.value)) {
                            console.log('what??')
                            return <span className="err-tip">请填写11位手机号码</span>
                        }
                    }}
                </div>

                <label className="lab">验证码</label>
                <div className="form-control-group">
                    <input ref="smsCode" defaultValue={this.props.smsCode} onBlur={()=>this.setState({smsCodeValidateOn: true})} id="signup_code" type="text" style={{width: 50 + '%'}}/>
                    {this.state.smsCodeValidateOn && !/^\w{6}$/.test(this.refs.smsCode.value) && <span className="err-tip">请填写6位验证码</span>}
                </div>

                <span id="signup_code_btn" style={{cursor:'pointer'}} className="getcode">获取验证码</span>
                <label className="lab">设置密码</label>
                <div className="form-control-group">
                    <input ref="pwd" defaultValue={this.props.pwd} onBlur={()=>this.setState({pwdValidateOn: true})} id="signup_pwd" type="password"/>
                    {this.state.pwdValidateOn && !/^\w{6,}$/.test(this.refs.pwd.value) && <span className="err-tip">密码至少为6位</span>}
                </div>

                <label className="lab">确认密码</label>
                <div className="form-control-group">
                    <input ref="rePwd" defaultValue={this.props.rePwd} onBlur={()=>this.setState({rePwdValidateOn: true})} id="signup_repwd" type="password"/>
                    {this.state.rePwdValidateOn && this.refs.pwd.value != this.refs.rePwd.value && <span className="err-tip">密码至少为6位</span>}
                </div>

                <a id="signup_btn" className="btn-login">注册</a>
            </div>
        );
    }
});

export default SignUp;