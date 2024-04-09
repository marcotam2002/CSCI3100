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

function MessageBox({ userID, followingUsers }) {
  const [currTarget, setCurrTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const setTarget = (user) => {
    setCurrTarget(user);
  };
  const handleInput = (event) => {
    setMessage(event.target.value);
  };

  const sendMessage = async () => {
    if (message && currTarget) {
      const data = { userID: userID, targetUserID: currTarget.userID, message: message };
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

  const handleKeyPress = (event) => {
    if (event.key == "Enter") {
      sendMessage();
    }
  };

  const getMessage = async (targetUser) => {
    if (targetUser != null) {
      const data = { userID: userID, targetUserID: targetUser.userID };
      const response = await fetch(`${API_BASE_URL}/api/user/getMessage`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.status === 200) {
        const fetchedMessages = await response.json();
        setMessageList(fetchedMessages);
      }

    } else {
      console.log("ERROR");
    }
  };

  useEffect(() => {
    if(currTarget){
      getMessage(currTarget);
    }
  }, [currTarget, message]);

  useEffect(() => {
    const interval = setInterval(() => {
      if(currTarget){
        getMessage(currTarget);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [currTarget]);
  return (
    <div id="messageInterface">
      <div id="userSideBar">
        {followingUsers.map((followingUser) => (
          <div
            id="usernameBox"
            key={followingUser.userID}
            onClick={() => setTarget(followingUser)}
            className={`${currTarget == followingUser ? "selected" : ""} ${followingUser == followingUsers[followingUsers.length - 1] && followingUsers.length > 7
              ? "last"
              : ""
              }`}
          >
            <h6>{followingUser.username}</h6>
          </div>
        ))}
      </div>
      <div id="messageBox">
        <div id="messageBoxHeader">
          <h5>{currTarget ? currTarget.username : "Please select a user"}</h5>
        </div>
        <div id="message">
          {messageList.map((message) => (
            <div key={message.messageid} className={message.senderid == userID ? "send" : "receive"}>
            <p>{message.content}</p>
            </div>
          ))}
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
  const [userList, setUserList] = useState([]);
  const [notificationState, setNotificationState] = useState(false);

  const user = getCookie("username");
  const userID = getCookie("userID");

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };

  const getMutualFollowing = async () => {
    const followingUsers = [];
    const response = await fetch(`${API_BASE_URL}/api/user/getMutualFollowing`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID: userID })
    });
    if (response.status === 200) {
      const followingUsersID = await response.json();
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
    else {
      console.log("Error in getting mutual following");

    }
    setUserList(followingUsers);
  }

  const updateNotificationState = async () => {
    const result = await CheckNotification();
    setNotificationState(result);
  };

  useEffect(() => {
    //updateNotificationState();
    getMutualFollowing();
    const interval = setInterval(() => {
      //updateNotificationState();
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