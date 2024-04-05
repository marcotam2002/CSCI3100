/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React from 'react';
import './LoginPage.css';
import './format.css';
import SoruIcon from '../assets/SoruIcon.png';
import LoginForm from './LoginForm';
import reactLogo from '../assets/react.svg';

function Login() {
    return (
        <div className="container" style={{ backgroundColor: 'lightpurple', marginTop: '20px' }}>
            <div className="left-side">
                <img src={SoruIcon} alt="SORU Image" width="200" />
                <div style={{ textAlign: 'left' }}>
                    <h3>Soru</h3>
                    <p>Where Soul is Touched</p>
                </div>
            </div>
            <div className="right-side" style={{ marginLeft: '20px' }}>
                <div>
                    <LoginForm />
                </div>
            </div>
        </div>
    );
}

export default Login;