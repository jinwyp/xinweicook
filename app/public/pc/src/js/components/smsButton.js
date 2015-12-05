import React from 'react'

const DURATION = 60;

var SignUp = React.createClass({

    getInitialState: function () {
        return {
            time: DURATION
        }
    },

    getSmsCode: function (data) {
        return $http.post('/api/user/sms', data)
    },

    render: function () {
        return (
            <span id="signup_code_btn" style={{cursor:'pointer'}} className="getcode">获取验证码</span>
        )
    }
});

export default SignUp;