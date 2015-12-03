import React from 'react'

var SignUp = React.createClass({
    render: function () {
        return (
            <div className="signup">
                <h6 className="title">注册</h6>
                <label className="lab">手机号</label><input id="signup_tel" type="text"/>
                <label className="lab">验证码</label><input id="signup_code" type="text" style="width: 50%;"/>
                <span id="signup_code_btn" style="cursor:pointer;" className="getcode">获取验证码</span>
                <label className="lab">设置密码</label><input id="signup_pwd" type="password"/>
                <label className="lab">确认密码</label><input id="signup_repwd" type="password"/>
                <a id="signup_btn" className="btn-login">注册</a>
            </div>
        );
    }
});

export default SignUp;