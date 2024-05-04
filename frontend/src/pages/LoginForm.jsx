/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// The fllowing codes are assisted by Chatgpt

import { React, useState } from 'react';
import './Form.css'
import RegistrationForm from './RegistrationForm';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

function LoginForm() {

  const [state, setState] = useState(false);
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
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
          const response = await fetch(`${API_BASE_URL}/api/user/login`, { 
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          if (response.status === 200){
              //successful login
              setErrorMessage("");
              const resdata = await response.json();
              // console.log(resdata);
              document.cookie = `username=${username}`;
              document.cookie = `userID=${resdata.userID}`;
              document.cookie = `role=${resdata.role}`;
              if (resdata.role==='user') {
                navigate('/userhomepage');
              } else if (resdata.role === 'admin') {
                navigate('/admin/usermanager');
              } else {
                setErrorMessage("Wrong user type. Please try again.");
                setPassword("");
                setUsername("");
              }
              
          }else if (response.status === 404) {
              // bad login: return error message
              const resdata = await response.json()
              console.log(resdata);
              setErrorMessage("Invalid username or password. Please try again.");
              setPassword("");
              setUsername("");
          } else {
              // system error
              const resdata = await response.json()
              console.log(resdata);
              setErrorMessage("System Error. Please try again.");
              setPassword("");
              setUsername("");
          }
    }

  return (
    <div>
      <div className={`popupBox ${state ? "show" : ""}`}>
        <div onClick={e => e.stopPropagation()}>
          <div id='RegForm'>
            <RegistrationForm closeFunc={closeRegForm}/>
          </div>
        </div>
      </div>
      <div className="form-box">
        <h5 className="centered-text"><b>Login to see more!</b></h5>
        <form onSubmit={handleSubmit} id="LoginForm">
          <label htmlFor="username">Username</label>
          <input id="usernameInput" type="text" placeholder="Enter your username" value={username}
            onChange={(event) => setUsername(event.target.value)} required />
          <div id="passwordText"><label htmlFor="password">Password</label><Link to={"/forgetpw"}>Forget Password?</Link></div>
          <input id="pswInput" type="password" placeholder="Enter your password" required value={password}
            onChange={(event) => setPassword(event.target.value)} />
          <br></br>
          {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
          <button className="submit" type="submit">Login</button>
          <hr style={{width:"100%"}}/>
        </form>
          <button className="register" onClick={openRegForm}>Register</button>
      </div>
    </div>
  );
}

export default LoginForm;
