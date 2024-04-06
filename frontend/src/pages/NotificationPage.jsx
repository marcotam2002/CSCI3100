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
import React, { useState } from "react";
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

const testNotification = [
    { username: "Alice", type: "like", read: false, notifcationsID: 1 },
    { username: "Bob", type: "comment", read: false, notifcationsID: 2 },
    { username: "Charlie", type: "follow", read: false, notifcationsID: 3 },
    { username: "David", type: "like", read: true, notifcationsID: 4 },
]

function NotifcationContent({ username, type }) {
    if (type === "like") {
        return (
            <p>{username} liked your post.</p>
        );
    } else if (type === "comment") {
        return (
            <p>{username} commented on your post.</p>
        );
    } else if (type === "follow") {
        return (
            <p>{username} followed you.</p>
        );
    }
}

function FollowButton({ username, type }) {
    if (type === "follow") {
        return (
            <div>
                <button>Follow</button>
                <button>Unfollow</button>
            </div>
        );
    }
}

function NotificationBox({ notifcations }) {
    return (
        <div>
            <table id="notificationTable">
                <tbody>
                    {notifcations.map((notice) => (
                        <tr>
                            <td>
                                <span class={`readStatus ${notice.read ? "read" : ""}`}> </span>
                            </td>
                            <td>
                                <NotifcationContent username={notice.username} type={notice.type} />
                            </td>
                            <td>
                                <FollowButton username={notice.username} type={notice.type} />
                            </td>
                        </tr>

                    ))}
                </tbody>
            </table>
        </div>
    );
}

function NotificationPage({ user }) {
    const [state, setState] = useState(false);
    const navigate = useNavigate();

    const openAddPost = () => {
        setState(true);
    };
    const closeAddPost = () => {
        setState(false);
    };
    console.log(user);
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
                        func={() => alert("This should redirect to Search page.")}
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
                    <NotificationBox notifcations={testNotification} />
                </div>
            </div>
        </div>
    );
}

export default NotificationPage;
