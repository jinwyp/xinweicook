import 'babel-polyfill'

import React from "react"
import ReactDom from "react-dom"
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import configureSignStore from '../stores/configureSignStore'
import SignIn from "../components/signin"
import SignUp from "../components/signup"


var App = React.createClass({
    render: function () {
        return (
            <div>
                <SignIn></SignIn>
                <SignUp {...this.props.signUpValue}></SignUp>
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

