/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ForgetPassword.css';
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

const ForgetPasswordForm = () => {
  const [username, setUsername] = useState('');
  const [securityAnswers, setSecurityAnswers] = useState('');
  const [step, setStep] = useState(1);
  const [errorMessage, setErrorMessage] = useState("");



  const handleSubmit = async(event) => {
    event.preventDefault();
    if (step === 1) {
      
      // for debugging
    //   console.log(username);
    //   console.log(securityAnswers);
    
    const data = {
        username: username,
        securityAnswers: securityAnswers, 
    };

    const response = await fetch(`${API_BASE_URL}/api/user/forgetpw`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify(data)
    });
    if (response.status === 200){
        // pass the security check.
        setErrorMessage("");
        setStep(2);
    }else {
        // fail the security check.
        setErrorMessage("Invalid input of username or security answer.")
        console.log(response.body);
    }

    // setStep(2);

    } else if (step === 2) {
      
      const password = document.getElementById("newPassword").value;
      const checkpassword = document.getElementById("confirmNewPassword").value;

      // for debugging
      console.log(password);
      console.log(checkpassword);

      if (password !== checkpassword){
        setErrorMessage('Password not the same!');
        return;
      }

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,20}$/;
      if (!passwordRegex.test(password)) {
        setErrorMessage(
          "Password must contain at least one character and one number, and have a length between 6 and 20 characters."
        );
        return;
      }
      
      // for debugging
      // console.log("Congrats.");

      const data = {
        username: username,
        password: password,
      }
      const response2 = await fetch(`${API_BASE_URL}/api/user/forgetpw/changepw`,{
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response2.status === 200){
        // successful update
        alert('Password updated successfully!');
        setErrorMessage("");
        setStep(3);
      }else{
        setErrorMessage("System Error. Please try again later.");
        console.log(response2.body);
      }  
    }
  };


  return (
    <div className='fullscreen'>
        <h2 style={{textAlign: "center"}}>Forget Password Form</h2>
        <div className="forget-password-form">
        <form onSubmit={handleSubmit}>
            {step === 1 && (
            <>
                <p style={{textAlign: "center"}}>Please input the following fields.</p>
                <label htmlFor="username">Username</label>
                <input
                type="text"
                id="username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                required
                />
                <label htmlFor="securityQuestion1">Who is your best friend?</label>
                <input
                type="text"
                id="securityQuestion1"
                value={securityAnswers}
                onChange={(event) => setSecurityAnswers(event.target.value)}
                required
                />
            </>
            )}
            {step === 2 && (
            <>
                <p style={{textAlign: "left", marginLeft: "5px"}}>Please set a new password.</p>
                <p style={{textAlign: "left", marginLeft: "5px"}}>Password must be a string of length ranging from 6 to 20 characters, with at least one character and one number.</p>
                <label htmlFor="newPassword">New password</label>
                <input type="password" id="newPassword" required />
                <label htmlFor="confirmNewPassword">Confirm new password</label>
                <input type="password" id="confirmNewPassword" required />
            </>
            )}
            {step === 3 && (
            <>
                <p style={{textAlign: "center"}}>Please return to Homepage for login.</p>
            </>
            )}
            {errorMessage && <p style={{color:"red"}}>{errorMessage}</p>}
            {step !==3 && <button type="submit">Submit</button>}
        </form>
        <Link className="Link" to={"/"}>Back to Home</Link>
        </div>
    </div>
  );
};

export default ForgetPasswordForm;