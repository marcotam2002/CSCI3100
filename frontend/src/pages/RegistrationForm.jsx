/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React, { useState } from "react";
import './RegistrationForm.css'
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

export default function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secans, setsecans] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      // Password validation
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
      if (!passwordRegex.test(password)) {
        setErrorMessage(
          "Password must contain at least one character and one number, and have a length between 6 and 20 characters."
        );
        setSuccessMessage("");
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
        setSuccessMessage("");
      }
      else if (response.status === 200) {
        setSuccessMessage("Registration is successful. You can login with the created username and password now.");
        setErrorMessage("");
      }
      else if (response.status === 500) {
        setErrorMessage("System Error. Please try again later.");
        setSuccessMessage("");
      }
  
      // Reset the form fields
      setUsername("");
      setPassword("");
      setsecans("");
    };
  
    return (
      <div className="RegisterForm">
        <h2 style={{textAlign: "center"}}>Registration Form</h2>
        <p>Please set a password with a length ranging from 6 to 20 characters, with at least one character and one number.</p>
        <form onSubmit={handleSubmit} id="registrationForm">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" required value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" required value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <p>Please input answers to the following security question:</p>
          <div>
            <label htmlFor="secans">Who is your best friend?</label>
            <input type="text" id="secans" required value={secans}
              onChange={(event) => setsecans(event.target.value)}
            />
          </div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <button className="btn-primary" style={{margin: "5px 5px"}} type="submit">Register</button>
        </form>
      </div>
    );
  }
