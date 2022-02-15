import './assets/css/style.css'
import React, {useState} from 'react'
import { BrowserRouter as Router, useRoutes } from 'react-router-dom'

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import routes from './Routes'

const Routing = () => {
    let routing = useRoutes(routes);
    return(routing)
}

const stripePublicKey = import.meta.env.EY_STRIPE_PUBLIC_KEY

const stripePromise = loadStripe(stripePublicKey)

const App = () => {

    return(
        <Elements stripe={stripePromise}>
            <div className="container">
                <Router>
                    <Routing/>
                </Router>
            </div>
        </Elements>
    )
}

export default App