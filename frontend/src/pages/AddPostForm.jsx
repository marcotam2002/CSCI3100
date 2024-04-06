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
import PhotoIcon from '../assets/photo-upload.svg'
const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

export default function AddPostForm() {
    
    const [thought, setThought] = useState("");
    const [fileURL, setFileURL] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [fileType, setFileType] = useState("");
  
    const handleSubmit = async (event) => {
      event.preventDefault();

      // The following codes serves the function of 
      // adding the submitted username and password to the database
      const data = {
          fileURL: fileURL,
          userID: userID,
          fileType: fileType,
          description: thought,
      }
  
      const response = await fetch(`${API_BASE_URL}/api/user/addpost`, { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        const message = await response.text();
        if (response.status === 200) {
          
        } else {
          setErrorMessage("System Error. Please try again later.");
        }
    };

    const handleFileUpload = (event) => {
      const file = event.target.files[0];

      if (!file) return;

      const fileName = file.name;
      const fileType = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();

      // for debugging
      // console.log(fileName);
      // console.log(fileType);
      const filURL = URL.createObjectURL(file);
      // console.log(filURL);
      setFileType(fileType);
      setFileURL(filURL);
    };
  
    return (
      <div className="Add-Post-Form">
        <h2 style={{textAlign: "center"}}>New post</h2>
        <form onSubmit={handleSubmit} id="NewPostForm">
          <div className="newpostdescription">
          <textarea id="thought" rows="20" required
            value={thought} placeholder="Tell us your current thought..."
            onChange={(event) => setThought(event.target.value)}
            />
          </div>
          <div className="addpostbutton">
                <button className="btn-primary" style={{margin: "10 px 5px"}} type="submit">Create</button>
                <label htmlFor="fileUpload" style={{marginRight: "5px"}}>
                <input type="file" id="fileUpload" accept=".jpg,.png,.mp4" style={{display: "none"}}
                    onChange={handleFileUpload}
                />
                <img src={PhotoIcon} alt="Upload Photo/Video" style={{cursor: "pointer", width: "3px", height: "30px"}} />
                </label>
            </div>
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
        </form>
      </div>
    );
  }

