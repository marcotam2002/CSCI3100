/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// The fllowing codes are assisted by Chapgpt

import React, { useRef } from "react";
import './Form.css'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { CrossButton } from "./components";
import { getCookie } from "./CookieHandlers";

export default function EditProfileForm({ closeFunc, originUserName, originDescription, originPrivacy }) {

    // The following gives the implementation of the form for user editing their profile information.
    
    const usernameRef = useRef(null);
    const descriptionRef = useRef(null);
    const isPrivateRef = useRef(null);
    const errorMessageRef = useRef(null);

    const userID = getCookie("userID");

    const handleSubmit = async (event) => {
        
        event.preventDefault();

        const username = usernameRef.current.value;
        const description = descriptionRef.current.value;
        const isPrivate = isPrivateRef.current.checked;

        let privacy = "";

        if (isPrivate) {
            privacy = "private";
        } else {
            privacy = "public";
        }

        const data = {
            username: username,
            userID: userID,
            description: description,
            isPrivate: privacy
        };

        const response = await fetch(`${API_BASE_URL}/api/profile/edit`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const message = await response.text();
        if (response.status === 200) {
            console.log("Edit successful.");
            alert("Successful Update");
            closeFunc();
        } else {
            errorMessageRef.current.innerText = "System Error. Please try again later.";
        }
    };

    return (
        <div id="editProfile">
            <CrossButton func={closeFunc} />
            <h2><b>Edit Profile</b></h2>
            <form onSubmit={handleSubmit} id="editProfileForm">
                <div className="username-input">
                    <label htmlFor="username">Username: </label>
                    <input
                        type="text"
                        defaultValue={originUserName}
                        ref={usernameRef}
                        required
                    />
                </div>
                <div className="userdescription">
                    <label htmlFor="description">Description: </label>
                    <textarea
                        id="description"
                        defaultValue={originDescription}
                        ref={descriptionRef}
                    />
                </div>
                <div className="setprivate">
                    <label htmlFor="privateAccount">Private account?</label>
                    <input
                        type="checkbox"
                        id="privateAccount"
                        defaultChecked={originPrivacy}
                        ref={isPrivateRef}
                        style={{ marginLeft: '10px' }}
                    />
                </div>
                <button className="submit" type="submit">Submit</button>
                <p ref={errorMessageRef} className="text-danger"></p>
            </form>
        </div>
    );
}
