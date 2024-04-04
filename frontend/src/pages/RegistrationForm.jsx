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

export default function RegistrationForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [secans1, setsecans1] = useState("");
    const [secans2, setsecans2] = useState("");
    const [secans3, setsecans3] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
    if (username === "") {
      setErrorMessage("Please input a valid username.");
      setSuccessMessage("");
      return;
    }
  
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
        secans1: secans1,
        secans2: secans2,
        secans3: secans3,
      }
  
      const response = await fetch('/register', { 
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
    };
  
    return (
      <div className="RegisterForm">
        <h2>Registration Form</h2>
        <p>Please set a password with a length ranging from 6 to 20 characters, with at least one character and one number.</p>
        <form onSubmit={handleSubmit} id="registrationForm">
          <div>
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <p>Please input answers to the following 3 security questions:</p>
          <div>
            <label htmlFor="secans1">Who is your best friend?</label>
            <input type="text" id="secans1" value={secans1}
              onChange={(event) => setsecans1(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="secans2">What is your primary school?</label>
            <input type="text" id="secans2" value={secans2}
              onChange={(event) => setsecans2(event.target.value)}
            />
          </div>
          <div>
            <label htmlFor="secans3">What is your favourite hobby?</label>
            <input type="text" id="secans3" value={secans3}
              onChange={(event) => setsecans3(event.target.value)}
            />
          </div>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <button className="btn btn-primary" style={{margin: "5px auto"}} type="submit">Register</button>
        </form>
      </div>
    );
  }