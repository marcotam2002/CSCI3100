/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import "./format.css";
import "./Profile.css";
import { Header, SideBarButton, CheckNotification } from "./components";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"
import homeIcon from "../assets/home.svg";
import addPostIcon from "../assets/addPost.svg";
import searchIcon from "../assets/search.svg";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import profileIcon from "../assets/user.svg";
import logoutIcon from "../assets/log-out.svg";
import AddPostForm from './AddPostForm';
import EditProfileForm from "./EditProfileForm";
import { getCookie } from "./CookieHandlers";
import { useNavigate } from 'react-router';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;

const testUser =
{
  userID: 2,
  username: "Peter",
  followersCount: 50,
  followingCount: 100,
  description: "What a wonderful day!\nI love to share my life with you.\nLet's enjoy the moment together.\n",
  isPrivate: true,
}

function UserProfile({ openFunc, isCurrentUser, user }) {


  const editProfile = () => {
    // For debugging.
    openFunc();
    console.log("Edit Profile function placeholder");
  };

  const followUser = () => {
    // For debugging.
    console.log("Follow User function placeholder");
  };
  return (
    <div id="profileBox">
      <div id="profileHeader">
        <h2><b>{user && user.username}</b></h2>
        <div id="followBox">
          <p><b>{user && user.followersCount}</b></p>
          <p> followers </p>
          <p><b>{user && user.followingCount}</b></p>
          <p> following </p>
        </div>
        <button onClick={isCurrentUser ? editProfile : followUser}>
          {isCurrentUser ? "Edit Profile" : "Follow"}
        </button>
      </div>
      <div id="descriptionBox">
        {user && user.description.split('\n').map((line, index) => (<p key={index}>{line}</p>))}
      </div>

      {/* Row 4: Posts */}
      <div><h5>Posts</h5></div>

      {/* Row 5 and onwards: User's posts */}
      {/* {user && user.posts.map(post => (
                <div key={post.id}>{post.content}</div>
            ))} */}
    </div>
  )
}

function Profile(){
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCookie("userID");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [profileUser, setProfileUser] = useState("");

  const openEditProfileForm = () => {
    setState2(true);
  };

  const closeEditProfileForm = () => {
    setState2(false);
  };

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  const user = getCookie("username");
  const { userID } = useParams();

  useEffect(() => {
    setIsCurrentUser(currentUser === userID);
  }, [userID, currentUser]);

  const getUser = async(userID) => {
    const data = {
      userID: userID,
    };
    const response = await fetch(`${API_BASE_URL}/api/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.json();
      setProfileUser(resdata.user);
      const data2 = {
        targetuserID: userID,
        currentuserID: currentUser
      };
      
    } else {
        const resdata = await response.json()
        console.log(resdata);
        console.log("System Error");
    }
  }

  useEffect(() => {
    getUser(userID);
  }, []);

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
      <div className={`popupBox ${state2 ? "show" : ""}`}>
        <div onClick={(e) => e.stopPropagation()}>
          <EditProfileForm 
          closeFunc={closeEditProfileForm} 
          originUserName={user.username} 
          originDescription={user.description}
          originPrivacy={user.isPrivate} />
        </div>
      </div>

      <Header subTitle={user} currPage={"User Page"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={homeIcon}
            name={"Home"}
            color={"black"}
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
            func = {()=>navigate('/search')}
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
            func = {()=>navigate('/notification')}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"#1D67CD"}
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
          <UserProfile openFunc={openEditProfileForm} isCurrentUser={isCurrentUser} user={profileUser}/>
        </div>
      </div>
    </div>
  );
}

export default Profile;
