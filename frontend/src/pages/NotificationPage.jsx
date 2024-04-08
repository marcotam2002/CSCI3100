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
import { Header, SideBarButton } from "./components";
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

function NotificationBox({ notifcations }) {
    console.log(notifcations);
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
                                <button> Accept   </button>
                                <button> Reject </button>
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
    const userID = getCookie("userID");
    const user = getCookie("username");
    const [notifications, setNotifications] = useState({});

    const getNotification = async () => {
        const notification = {};
        const userID = getCookie("userID");
        let data = [];
        const response = await fetch(`${API_BASE_URL}/api/user/getNotification`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ userID: userID })
        });
        if (response.status === 200) {
            data = await response.json();
        }
        for (let i = 0; i < data.length; i++) {
            const response = await fetch(`${API_BASE_URL}/api/admin/getUser`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ userID: data[i] })
            });
            if (response.status === 200) {
                const user = await response.json();
                notification[data[i]] = user.username;
            }
            else {
                console.log("Error in getting user data");
            }
        }
        setNotifications(notification);
    }

    useEffect(() => { getNotification();}, []); 
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
                        color={"black"}
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
                    <NotificationBox notifcations={notifications} />
                </div>
            </div>
        </div>
    );
}

export default NotificationPage;
