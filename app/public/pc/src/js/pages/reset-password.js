import './common' //none react. for html header

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import configureSignStore from '../stores/configureSignStore'
import {resetPwd} from "../actions/sign"
import ResetPwd from "../components/reset-password"


var App = React.createClass({
    render: function () {
        const {resetPwdValue, dispatch} = this.props;
        return (
            <div>
                <ResetPwd {...resetPwdValue} resetPwd={data => dispatch(resetPwd(data))}></ResetPwd>
            </div>
        );
    }
});

var WrappedApp = connect(state => state)(App);

var store = configureSignStore();

var rootElement = document.getElementById('react-root');

ReactDom.render(
    <Provider store={store}><WrappedApp/></Provider>,
    rootElement
);

