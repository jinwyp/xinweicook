import React from 'react'

var SignIn = React.createClass({
    render: function () {
        return (
            <div className="login">
                <h6 className="title">登录</h6>
                <label for=signin_tel className="lab">手机号</label>
                <input id="signin_tel" type="text"/>
                <label for=signin_pwd className="lab">密码</label>
                <input id="signin_pwd" type="password"/>
                <a id="resetpwd" className="forgot">忘记密码了</a>
                <a id="signin_btn" className="btn-login">登录</a>
            </div>
        );
    }
});

export default SignIn;