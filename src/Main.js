import React from 'react'
import App from './App'
import { Router } from "@reach/router"
// Redux imports
import { Provider } from 'react-redux'
import configureStore from "./redux/configureStore"
// My components
import AuthenticatedComponent from './components/AuthenticatedComponent'
import Login from './components/LoginView'

// Default components
const NotFound = () => <p>404! Sorry, nothing here</p>
// Init app 
const store = configureStore()

const MODE = process.env.REACT_APP_MODE || "STANDALONE"

export default (props) => (
    <Provider store={store}>
        <Router>
            <NotFound default />
            { MODE === "PROXY" ? (
                <App path="/" default />
            ) : (
                <AuthenticatedComponent path="/" default>
                    <App path="/" />
                </AuthenticatedComponent>
            ) }
            <Login path="/login" />
        </Router>
    </Provider>
)