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
import { Link } from 'react-router-dom';

function LoginForm() {

    const [state, setState] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const openRegForm = () => {
        setState(true);
      };
      const closeRegForm = () => {
        setState(false);
      };

      
    const navigate = useNavigate();
    //load saved username from cookie

        
    //handler for fetching of the form
    const handleSubmit = async (event) => {
          event.preventDefault();
          
          const data = {
              username: username,
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
              console.log("Error")
              setPassword("");
              setUsername("");
          }
    
    }

    return (
        <div>
            <div className={`popupBox ${state ? "show" : ""}`} onClick={closeRegForm}>
              <div onClick={e => e.stopPropagation()}>
                <div id='RegForm'>
                    <RegistrationForm />
                </div>
              </div>
            </div>
            <div className="form-box">
                <h5 className="centered-text">Login to see more</h5>
                <form onSubmit={handleSubmit} id="LoginForm">
                  <label htmlFor="username">Username*</label>
                  <input id="usernameInput" type="text" placeholder="Enter your username" value={username}
                      onChange={(event) => setUsername(event.target.value)} required />
                  <label htmlFor="password">Password*</label>
                  <input id="pswInput" type="password" placeholder="Enter your password" required value={password}
                      onChange={(event) => setPassword(event.target.value)} />
                  <br></br>
                  <Link to={"/forgetpw"}>Forget Password</Link>
                  <br></br>
                  <button className="submit" type="submit">Login</button>
                  <hr className="line" />
                  <button className="register-btn" onClick={()=>openRegForm()}>Register</button>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;