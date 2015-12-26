import 'babel-polyfill'
import './_common' //none react. for html header

import React from "react"
import ReactDom from "react-dom"
import { Provider, connect } from 'react-redux'
import configureSignStore from '../stores/configureSignStore'
import {signUp, signIn} from "../actions/sign"
import SignIn from "../components/signin"
import SignUp from "../components/signup"


var App = React.createClass({
    render: function () {
        const {signUpValue, signInValue, dispatch} = this.props;
        return (
            <div>
                <SignIn {...signInValue} signIn={data => dispatch(signIn(data))}></SignIn>
                <SignUp {...signUpValue} signUp={data => dispatch(signUp(data))}></SignUp>
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

