/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React, { useState } from "react";
import './Form.css'
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;
import { CrossButton } from "./components";
import { getCookie } from "./CookieHandlers";

export default function EditProfileForm({closeFunc, originUserName, originDescription, originPrivacy}) {
    const [username, setUsername] = useState(originUserName);
    const [isPrivate, setIsPrivate] = useState(originPrivacy);
    const [errorMessage, setErrorMessage] = useState("");
    const [description, setDescription] = useState(originDescription);
    const userID = getCookie("userID");
    
    const handleToggle = () => {
        setIsPrivate(!isPrivate);
    };

    const handleSubmit = async (event) => {
      event.preventDefault();

      // The following codes serves the function of 
      // adding the submitted username and password to the database
      const data = {
          username: username,
          userID: userID,
          description: description,
          isPrivate: isPrivate,
      }
  
      const response = await fetch(`${API_BASE_URL}/api/user/profile/edit`, { 
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const message = await response.text();
        if (response.status === 200) {
          console.log("Edit successful.");
        } else {
          setErrorMessage("System Error. Please try again later.");
        }
    };

  
    return (
      <div id="editProfile">
        <CrossButton func={closeFunc}/>
        <h2><b>Edit Profile</b></h2>
        <form onSubmit={handleSubmit} id="editProfileForm">
          <div className="username-input">
            <label htmlFor="username">Username: </label>
            <input type="text" value={username}
                onChange={(event) => setUsername(event.target.value)} />
          </div>
          <div className="userdescription">
            <label htmlFor="description">Description: </label>
                <textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
          </div>
          <div className="setprivate">
            <label htmlFor="privateAccount">Private account?</label>
            <input
                type="checkbox"
                id="privateAccount"
                checked={isPrivate}
                onChange={handleToggle}
                style={{ marginLeft: '10px' }}
            />
          </div>
            <button className="submit" type="submit">Submit</button>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </form>
      </div>
    );
  }