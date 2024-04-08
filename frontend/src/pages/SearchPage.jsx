/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import "./format.css";
import "./SearchPage.css";
import { Header, SideBarButton, CheckNotification } from "./components";
import React, { useState, useEffect } from "react";
import homeIcon from "../assets/home.svg";
import addPostIcon from "../assets/addPost.svg";
import searchIcon from "../assets/search.svg";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import profileIcon from "../assets/user.svg";
import logoutIcon from "../assets/log-out.svg";
import AddPostForm from './AddPostForm';
import { getCookie } from "./CookieHandlers";
import { useNavigate } from 'react-router';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;


function UserSearch() {
  const [searchType, setSearchType] = useState("general");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      searchType: searchType,
      searchText: searchText
    }

    console.log(data);

    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    // console.log('Response:', response);

    if (response.status === 200){
      const resdata = await response.json();
      setSearchResults(resdata); 
      console.log(resdata);
    } else {
      // system error
      const resdata = await response.json()
      console.log('Error:', resdata.message);
    }
  };

  return (
    <div id="Search">
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search..."
          />
          <label>
            <select value={searchType} onChange={handleSearchTypeChange}>
              <option value="general">general</option>
              <option value="username">username</option>
              <option value="tag">tag</option>
            </select>
          </label>
          <button type="submit">Search!</button>
        <div>
        </div>
      </form>

      <div>
        {searchResults.length > 0 ? (
          <ul>
            {searchType === 'general' ? (
              searchResults.map(result => (
                <li key={result.postid}>{result.postid}</li>
              ))
            ) : searchType === 'username' ? (
              searchResults.map(result => (
                <li key={result.userid}>{result.userid}</li>
              ))
            ) : searchType === 'tag' ? (
              searchResults.map(result => (
                <li key={result}>{result}</li>
              ))
            ) : (
              <p>No results found</p>
            )}
          </ul>
        ) : (
          <p>No results found</p>
        )}
      </div>
  </div>
    );
}

function SearchPage() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  const user = getCookie("username");

  const [notificationState, setNotificationState] = useState(false);
  const updateNotificationState = async () => {
    const result = await CheckNotification();
    setNotificationState(result);
  };
  useEffect(() => {
    updateNotificationState();
    const interval = setInterval(() => {
      updateNotificationState();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div className={`popupBox ${state ? "show" : ""}`}>
        <div onClick={(e) => e.stopPropagation()}>
          <AddPostForm closeFunc={closeAddPost} />
        </div>
      </div>

      <Header subTitle={user} currPage={"User Page"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={homeIcon}
            name={"Home"}
            color={"#1D67CD"}
            func={() => navigate('/userhomepage')}
          />
          <SideBarButton
            image={addPostIcon}
            name={"Add Post"}
            color={"black"}
            func={() => openAddPost()}
          />
          <SideBarButton
            image={searchIcon}
            name={"Search"}
            color={"black"}
            func={() => navigate('/search')}
          />
          <SideBarButton
            image={messageIcon}
            name={"Message"}
            color={"black"}
            func={() => navigate('/message')}
          />
          <SideBarButton
            image={notificationIcon}
            name={"Notification"}
            color={notificationState ? "red" : "black"}
            func={() => navigate('/notification')}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"black"}
            func={() => navigate(`/profile/${getCookie("userID")}`)}
          />
          <SideBarButton
            image={logoutIcon}
            name={"Log out"}
            color={"black"}
            func={() => navigate("/")}
          />
        </div>
        <div id="main">
          <UserSearch />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;