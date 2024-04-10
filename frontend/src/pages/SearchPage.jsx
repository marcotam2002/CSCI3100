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
import "./Post.css"
import { Header, SideBarButton, CheckNotification, CheckUnreadMessages } from "./components";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PostCard({ post, navigateFunc }) {
  const [username, setUsername] = useState("");
  const getUserName = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/getUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: post.authorid })
    });
    if (response.status === 200) {
      const resdata = await response.json();
      setUsername(resdata.username);
    } else {
      // system error
      console.log('Error:', resdata.message);
    }
  }
  const postSplit = post.content.split('\n');
  // if postSplit.length > 3, only show the first 3 lines, add ... to the end
  const postContent = postSplit.length > 3 ? [postSplit[0], postSplit[1], postSplit[2], "..."] : postSplit;
  useEffect(() => {
    getUserName();
  }, []);

  return (
    <div id="postCard" onClick={() => navigateFunc(`/post/${post.postid}`)}>
      <div className="post-header">
        <span className="post-username">{username}</span>
        <span className="post-time">{post.time}</span>
      </div>
      <div className="post-description">
        {postContent.map((line, index) => (<p key={index}>{line}</p>))}
      </div>
    </div>
  );
}

function UserCard({ userid, username, userDescription, navigateFunc }) {
  let description = [];
  if (userDescription != null) {
    const descrptionSplit = userDescription.split('\n');
    description = descrptionSplit.length > 3 ? [descrptionSplit[0], descrptionSplit[1], descrptionSplit[2], "..."] : descrptionSplit;
    console.log(description);
  }
  return (
    <div id="userCard" onClick={() => navigateFunc(`/profile/${userid}`)}>
      <div className="userCardHeader">
        <span className="username">{username}</span>
      </div>
      <div className="userDescription">
        {description.map((line, index) => (<p key={index}>{line}</p>))}
      </div>
    </div>
  );
}

function UserSearch({ navigateFunc }) {
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
    if (searchType == "tag") {
      data.searchText = searchText.match(/#\w+/g);
    }
    if (data.searchText == null) {
      data.searchText = "";
    }
    const response = await fetch(`${API_BASE_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (response.status === 200) {
      const resdata = await response.json();
      setSearchResults(resdata);
      console.log(resdata);
    } else {
      // system error
      const resdata = await response.json();
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
      </form>
      <h5 style={{ margin: "20px", marginLeft: "0px" }}><b>{searchResults.length > 0 ? "Search result" : "No result found"}</b></h5>
      {searchResults.length > 0 ? <hr ></hr> : null}
      <div>
        {searchResults.length > 0 ?
          searchType == "general" || searchType == "tag" ? searchResults.map((result) => <PostCard key={result.postid} post={result} navigateFunc={navigateFunc} />) :
            searchType == "username" ? searchResults.map((result) => <UserCard userid={result.userid} username={result.username} userDescription={result.description} navigateFunc={navigateFunc} />) : null : null}
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
  const [unreadMessages, setUnreadMessages] = useState(false);

  const updateState = async () => {
    const result = await CheckNotification();
    setNotificationState(result);
    const result2 = await CheckUnreadMessages();
    setUnreadMessages(result2);
  };

  useEffect(() => {
    updateState();
    const interval = setInterval(() => {
      updateState();
      console.log("unread messages", unreadMessages);
    }, 3000);
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
            color={unreadMessages ? "red" : "black"}
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
          <UserSearch navigateFunc={navigate} />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;