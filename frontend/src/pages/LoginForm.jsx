import React from 'react';
import './LoginForm.css'
import { useEffect } from 'react'
import { useNavigate } from 'react-router';

function LoginForm() {

    const navigate = useNavigate();
    //load saved username from cookie

        
    //handler for fetching of the form
    useEffect(() => {
        document.getElementById('loginForm').addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('usernameInput').value;
            const password = document.getElementById('pswInput').value;
            const data = {
                username: name,
                password: password
            };
      
            // use POST method to send a request to the server
            const response = await fetch('/', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
            if (response.status === 200){
                //successful login
                const resdata = await response.json()
                document.cookie = "username="+resdata.username ;
                document.cookie = "role="+ resdata.role;
                navigate('/homepage')
            }else{
                //bad login: return error message
                console.log(response.body)
                document.getElementById('usernameInput').value = '';
                document.getElementById('pswInput').value = '';
            }
        })
    
    })

    return (
        <div className="form-box" id="loginForm">
            <h5 className="centered-text">Login to see more</h5>
            <p className="blue-text">Username*</p>
            <input id="usernameInput" type="text" placeholder="Enter your username" required />
            <p className="blue-text">Password*</p>
            <input id="pswInput" type="password" placeholder="Enter your password" required />
            <br></br>
            <button className="forgot-password">Forget Password</button>
            <br></br>
            <button className="submit">Submit</button>
            <hr className="line" />
            <button className="register-btn">Register</button>
        </div>
    );
}

export default LoginForm;
