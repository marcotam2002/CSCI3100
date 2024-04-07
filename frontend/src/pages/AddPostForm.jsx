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
import uploadIcon from '../assets/upload.svg'
import {getCookie} from "./CookieHandlers.js"
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { CrossButton } from "./components";

export default function AddPostForm({ closeFunc }) {

  const [thought, setThought] = useState("");
  const [fileURL, setFileURL] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [fileType, setFileType] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

      //console.log(getCookie("userID")); //cookie test

    // The following codes serves the function of 
    // adding the submitted username and password to the database

    const data = {
      fileURL: fileURL,
      userID: getCookie("userID"),
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
    <div id="addPost">
      <CrossButton func={closeFunc} />
      <h2><b>New post</b></h2>
      <form onSubmit={handleSubmit} id="NewPostForm">
        <div className="newpostdescription">
          <textarea required
            value={thought} placeholder="Tell us your current thought..."
            onChange={(event) => setThought(event.target.value)}
          />
        </div>
        <div className="addpostbutton">
          <button className="btn-primary" type="submit">Post!</button>
          <label htmlFor="fileUpload">
            <input type="file" id="fileUpload" accept=".jpg,.png,.mp4" onChange={handleFileUpload}/>
            <img src={uploadIcon} alt="Upload Photo/Video"/>
          </label>
        </div>
        {errorMessage && <p className="text-danger">{errorMessage}</p>}
      </form>
    </div>
  );
}

