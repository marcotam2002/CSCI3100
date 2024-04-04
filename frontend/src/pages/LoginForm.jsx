/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import { React, useEffect, useState, useRef } from 'react';
import './LoginForm.css'
import RegistrationForm from './RegistrationForm';
import { useNavigate } from 'react-router';

function LoginForm() {

    const [state, setState] = useState(false);
    const popUpRef = useRef(null);

    const openRegForm = () => {
        setState(true);
      };
      const closeRegForm = () => {
        setState(false);
      };

      const handleClickOutside = (event) => {
        if (state && popUpRef.current && !popUpRef.current.contains(event.target) && !event.target.closest('#RegForm')) {
          closeRegForm();
        }
      };
      
      useEffect(() => {
        const handleOutsideClick = (event) => {
          handleClickOutside(event);
        };
      
        document.addEventListener('click', handleOutsideClick);
        return () => {
          document.removeEventListener('click', handleOutsideClick);
        };
      }, []);
      
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
                document.cookie = "username="+ name;
                document.cookie = "userID" + resdata.userID
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
        <div>
            <div ref={popUpRef} className={`popupBox ${state ? "show" : ""}`}>
                <div id='RegForm'>
                    <RegistrationForm />
                </div>
            </div>
            <div className="form-box" id="loginForm">
                <h5 className="centered-text">Login to see more</h5>
                <label htmlFor="username">Username*</label>
                <input id="usernameInput" type="text" placeholder="Enter your username" required />
                <label htmlFor="password">Password*</label>
                <input id="pswInput" type="password" placeholder="Enter your password" required />
                <br></br>
                <button className="forgot-password">Forget Password</button>
                <br></br>
                <button className="submit">Login</button>
                <hr className="line" />
                <button className="register-btn" onClick={()=>openRegForm()}>Register</button>
            </div>
        </div>
    );
}

export default LoginForm;
