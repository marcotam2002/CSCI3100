/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React, { useState } from "react";
import './Form.css';
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;
import { CrossButton } from "./components";

export default function RegistrationForm({closeFunc}) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secans, setsecans] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      if (username.length > 20) {
        setErrorMessage(
          "Username cannot exceed 20 characters."
        );
        return;
      }
      // Password validation
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
      if (!passwordRegex.test(password)) {
        setErrorMessage(
          "Password must contain at least one character and one number, and have a length between 6 and 20 characters."
        );
        return;
      }
  
      
  
      // The following codes serves the function of 
      // adding the submitted username and password to the database
      const data = {
        username: username,
        password: password,
        secans: secans
      }
  
      const response = await fetch(`${API_BASE_URL}/api/user/register`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
      
      const message = await response.text();
      if (response.status === 403) {
        setErrorMessage("This username has been registered. Please use another one.")
      }
      else if (response.status === 200) {
        alert("Registration is successful. You can login with the created username and password now.");
        setErrorMessage("");
        closeFunc();
      }
      else if (response.status === 500) {
        setErrorMessage("System Error. Please try again later.");
      }
  
      // Reset the form fields
      setUsername("");
      setPassword("");
      setsecans("");
    };
  
    return (
      <div className="RegisterForm">
        <CrossButton func={closeFunc}/>
        <h2>Registration Form</h2>
        <p>Please create your username with no more than 20 characters.</p>
        <p>Please set a password with a length ranging from 6 to 20 characters, with at least one character and one number.</p>
        <form onSubmit={handleSubmit} id="registrationForm">
          <div>
            <label htmlFor="username"><b>Username: </b></label>
            <input type="text" required value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password"><b>Password: </b></label>
            <input type="password" required value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <p>Please input answers to the following security question:</p>
          <div>
            <label htmlFor="secans"><b>Who is your best friend?</b></label>
            <input type="text" required value={secans}
              onChange={(event) => setsecans(event.target.value)}
            />
          </div>
          {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
          <button className="register" type="submit">Register</button>
        </form>
      </div>
    );
  }
