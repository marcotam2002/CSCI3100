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
import SoruIcon from '../assets/SoruIcon.png'
import reactLogo from '../assets/react.svg'

const Login = () => {
    return (
        <div className="container">
            <div className="left-column">
                <img src={SoruIcon} alt="SORU Image" width="200" />
                <h1>Soru</h1>
                <p>Where Soul is Touched</p>
            </div>
            <div className="right-column">
                <form>
                    <h5 className="centered-text">Login to see more</h5>
                    <input type="text" placeholder="Username" required />
                    <input type="password" placeholder="Password" required />
                    <div className="forgot-password">
                        <a href="#">Forgot Password</a>
                    </div>
                    <button className='submit-btn'>Submit</button>
                </form>
                <div className="line"></div>
                <button className="register-btn">Register</button>
            </div>
        </div>
    );
}

export default Login;
