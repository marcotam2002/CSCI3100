/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

//todo: link "Soru" to main page
import "./format.css";
import "./MessagePage.css";
import { Header, SideBarButton, CheckNotification } from "./components";
import React, { useState, useEffect } from "react";
import homeIcon from "../assets/home.svg";
import addPostIcon from "../assets/addPost.svg";
import searchIcon from "../assets/search.svg";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import profileIcon from "../assets/user.svg";
import logoutIcon from "../assets/log-out.svg";
import sendIcon from "../assets/send.svg";
import AddPostForm from "./AddPostForm";
import { getCookie } from "./CookieHandlers";
import { useNavigate } from 'react-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* for testing */
const testFollowingUsers = [
  { username: "Alice", userid: 1 },
  { username: "Bob", userid: 2 },
  { username: "Charlie", userid: 3 },
  { username: "David", userid: 4 },
  { username: "Eve", userid: 5 },
  { username: "Frank", userid: 6 },
  { username: "Grace", userid: 7 },
  { username: "Helen", userid: 8 },
  { username: "Ivy", userid: 9 },
  { username: "Jack", userid: 10 },
  { username: "Kelly", userid: 11 },
  { username: "Lily", userid: 12 },
  { username: "Mary", userid: 13 },
  { username: "Nancy", userid: 14 },
  { username: "Oscar", userid: 15 },
];

function MessageBox({ userID, followingUsers }) {
  const [currTarget, setCurrTarget] = useState(null);
  const [message, setMessage] = useState("");
  const time = new Date().toLocaleTimeString();
  const setTarget = (user) => {
    setCurrTarget(user);
  };
  const handleInput = (event) => {
    setMessage(event.target.value);
  };
  const sendMessage = async () => {
    if (message && currTarget) {
        const data = { userID: userID, targetUserID: currTarget.userID, message: message};
        const response = await fetch(`${API_BASE_URL}/api/user/sendMessage`, {
          method: "PUT",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (response.status === 200) {
          console.log("message sent");
        } else {
          console.log("ERROR");
        }
      setMessage("");
    }
  };
  const receiveMessage = async () => {
  
  }
  const handleKeyPress = (event) => {
    if (event.key == "Enter") {
      sendMessage();
    }
  };
  return (
    <div id="messageInterface">
      <div id="userSideBar">
        {followingUsers.map((followingUser) => (
          <div
            id="usernameBox"
            key={followingUser.userid}
            onClick={() => setTarget(followingUser)}
            className={`${currTarget == followingUser ? "selected" : ""} ${followingUser == followingUsers[followingUsers.length - 1] && followingUsers.length > 6
              ? "last"
              : ""
              }`}
          >
            <h6>{followingUser.username}</h6>
            <p className="p2">Here should be latest message</p>
          </div>
        ))}
      </div>
      <div id="messageBox">
        <div id="messageBoxHeader">
          <h5>{currTarget ? currTarget.username : "Please select a user"}</h5>
        </div>
        <div id="message">
          <h5></h5>
        </div>
        <div id="sendMessageBox">
          <input
            type="text"
            placeholder="Start a new message"
            id="messageInput"
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyPress}
          ></input>{" "}
          <button onClick={sendMessage} id="sendButton"><img src={sendIcon} alt="" /></button>
        </div>
      </div>
    </div>
  );
}

function Message() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  const user = getCookie("username");
  const userID = getCookie("userID");
  const [userList, setUserList] = useState([]);
  const getFollowingUsers = async () => {
    const followingUsers = [];
    const response = await fetch(`${API_BASE_URL}/api/user/getFollowingUser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: userID })
    });
    if (response.status === 200) {
      const data = await response.json();
      const followingUsersID = data.map(user => user.followingid);
      for (let i = 0; i < followingUsersID.length; i++) {
        const response = await fetch(`${API_BASE_URL}/api/admin/getUser`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userID: followingUsersID[i] })
        });
        if (response.status === 200) {
          const followingUser = await response.json();
          followingUsers.push({ userID: followingUsersID[i], username: followingUser.username });
        }
        else {
          console.log("Error in getting user data");
        }
      }
    }
    setUserList(followingUsers);
  }
  const [notificationState, setNotificationState] = useState(false);
  const updateNotificationState = async () => {
    const result = await CheckNotification();
    setNotificationState(result);
  };
  useEffect(() => {
    updateNotificationState();
    getFollowingUsers();
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

      <Header subTitle={user} currPage={"Message Page"} />
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
            func={() => navigate('/search')}
          />
          <SideBarButton
            image={messageIcon}
            name={"Message"}
            color={"#1D67CD"}
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
          <MessageBox userID={userID} followingUsers={userList} />
        </div>
      </div>
    </div>
  );
}

export default Message;