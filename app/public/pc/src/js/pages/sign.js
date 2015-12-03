import 'babel-core/polyfill.js'

import React from "react"
import ReactDom from "react-dom"
import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'
import SignIn from "../components/signin"
import SignUp from "../components/signup"


var App = React.createClass({
    render: function () {
        return (
            <div>
                <SignIn></SignIn>
                <SignUp></SignUp>
            </div>
        );
    }
});

var WrappedApp = connect(state => state)(App);

var rootElement = document.getElementById('react-root');

ReactDom.render(
    <Provider store><WrappedApp/></Provider>,
    rootElement
);

