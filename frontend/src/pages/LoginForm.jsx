import React from 'react';
import './LoginForm.css'

function LoginForm() {
    return (
        <div className="form-box">
            <h5 className="centered-text">Login to see more</h5>
            <p className="blue-text">Username*</p>
            <input type="text" placeholder="Enter your username" required />
            <p className="blue-text">Password*</p>
            <input type="password" placeholder="Enter your password" required />
            <br></br>
            <button className="forgot-password">Forget Password</button>
            <br></br>
            <button className="submit-btn">Submit</button>
            <hr className="line" />
            <button className="register-btn">Register</button>
        </div>
    );
}

export default LoginForm;
