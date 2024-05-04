/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// The fllowing codes are assisted by Chatgpt

import React from 'react';
import './LoginPage.css';
import './format.css';
import SoruIcon from '../assets/SoruIcon.png';
import LoginForm from './LoginForm';


function Login() {
    return (
        <div  className="container">
            <div className="left-side">
                <img src={SoruIcon} alt="SORU Image" width="200" />
                <div className="web-name">
                    <h2><b>Soru</b></h2>
                    <p>Where Soul is Touched</p>
                </div>
            </div>
            <div className="right-side">
                <LoginForm />
            </div>
        </div>
    );
}

export default Login;
