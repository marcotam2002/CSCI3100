/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import "./format.css";
import "./NotificationPage.css";
import { Header, SideBarButton, CheckUnreadMessages } from "./components";
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

function NotificationBox({ notifcations , action}) {
    return (
        <div>
            <table id="notificationTable">
                <tbody>
                    {Object.keys(notifcations).map((key) => (
                        <tr key={key}>
                            <td className="notificationName">
                                <p><b>{notifcations[key]}</b></p>
                            </td>
                            <td className="notificationContent">
                                <p>request to follow you!</p>
                            </td>
                            <td className="notificationButton">
                                <button className="acceptFollow" onClick={() => action(true, key)}> Accept </button>
                                <button className="rejectFollow" onClick={() => action(false, key)}> Reject </button>
                            </td>
                        </tr>
                    ))} 
                </tbody>
                </table>
        </div>
    );
}

function NotificationPage() {
    const [state, setState] = useState(false);
    const navigate = useNavigate();

    const openAddPost = () => {
        setState(true);
    };
    const closeAddPost = () => {
        setState(false);
    };
    const user = getCookie("username");
    const [notifications, setNotifications] = useState({});
    const userID = getCookie("userID");

    const getNotification = async () => {
        const notification = {
            'requestedUsers': [],
            'recommendedUsers': []
        };
        let data = [];
        const response = await fetch(`${API_BASE_URL}/api/user/getNotification`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userID: userID })
        });
        if (response.status === 200) {
            data = await response.json();
            console.log(data.requestedUsers);
            console.log(data.recommendedUsers);
        }
        else{
            console.log("Error in getting notification data");
        }
        for (let i = 0; i < data.requestedUsers.length; i++) {
            const response = await fetch(`${API_BASE_URL}/api/admin/getUser`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userID: data.requestedUsers[i] })
            });
            if (response.status === 200) {
                const user = await response.json();
                notification.requestedUsers[i] = user.username;
            }
            else {
                console.log("Error in getting requested user data");
            }
        }
        for (let i = 0; i < data.recommendedUsers.length; i++) {
            const response = await fetch(`${API_BASE_URL}/api/admin/getUser`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userID: data.recommendedUsers[i] })
            });
            if (response.status === 200) {
                const user = await response.json();
                notification.recommendedUsers[i] = user.username;
            }
            else {
                console.log("Error in getting recommended user data");
            }
        }
        console.log(notification);
        setNotifications(notification);
    }

    
    const notificationAction = async (action, targetUserID) => {
        if(action) //accept
        {
            const response = await fetch(`${API_BASE_URL}/api/user/acceptFollowRequest`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userID:userID, targetUserID:targetUserID })
            });
            if (response.status === 200) {
                console.log("Successfully accepted follow request");
                alert("Successfully accepted follow request!");
            }
            else {
                console.log("Error in accepting follow request");
                alert("Error in accepting follow request!");
            }
        }
        else
        {
            const response = await fetch(`${API_BASE_URL}/api/user/rejectFollowRequest`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userID:userID, targetUserID:targetUserID })
            });
            if (response.status === 200) {
                console.log("Successfully rejected follow request");
                alert("Successfully rejected follow request!");
            }
            else {
                console.log("Error in rejecting follow request");
                alert("Error in rejecting follow request!");
            }
        }
        getNotification();
    }
    const [unreadMessages, setUnreadMessages] = useState(false);

    const updateState = async () => {
        const result = await CheckUnreadMessages();
        setUnreadMessages(result);
    };
    
    useEffect(() => {
        getNotification();
        updateState();
        const interval = setInterval(() => {
            getNotification();
            updateState();
        }, 3000);
        return () => clearInterval(interval);
      }, []);
    
    
    return (
        <div>
            <div className={`popupBox ${state ? "show" : ""}`} onClick={closeAddPost}>
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
                        color={unreadMessages ? "red" : "black"}
                        func={() => navigate('/message')}
                    />
                    <SideBarButton
                        image={notificationIcon}
                        name={"Notification"}
                        color={"#1D67CD"}
                        func={() => navigate("/notification")}
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
                    <NotificationBox notifcations={notifications} action={notificationAction}/>
                </div>
            </div>
        </div>
    );
}

export default NotificationPage;
