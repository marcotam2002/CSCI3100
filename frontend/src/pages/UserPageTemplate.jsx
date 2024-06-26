/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// The fllowing codes are assisted by Chatgpt

import "./format.css";
import { Header, SideBarButton } from "./components";
import React, {useState} from "react";
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

const testPost = [
  {
    postID: 1,
    username: "Billy",
    time: "8 hours",
    description:
    "The sun rose gracefully over the horizon, casting golden hues across the sky.\nBirds chirped joyfully, welcoming the new day with their melodic songs.\nA gentle breeze rustled the leaves of the trees, carrying with it the scent of fresh blooms.\nNature's symphony echoed through the tranquil morning air.",
    liked: true,
    likes: 50,
    commentnum: 2,
    comments: [
      { username: "Alice", text: "Beautiful description!" },
      { username: "Bob", text: "I love mornings like these." }
    ]
  },
  {
    postID: 2,
    username: "Tim",
    time: "17:16",
    description:
    "I want to post nothing here.\n Please go.",
    liked: false,
    likes: 1,
    commentnum: 3,
    comments: [
      { username: "Admin", text: "So rude!" },
      { username: "Hei", text: "Aiiii......"},
      { username: "Abdon", text: "Read."},
    ]
  },
  {
    postID: 3,
    username: "Billy",
    time: "8 hours",
    description:
    "The sun rose gracefully over the horizon, casting golden hues across the sky.\nBirds chirped joyfully, welcoming the new day with their melodic songs.\nA gentle breeze rustled the leaves of the trees, carrying with it the scent of fresh blooms.\nNature's symphony echoed through the tranquil morning air.",
    liked: true,
    likes: 50,
    commentnum: 2,
    comments: [
      { username: "Alice", text: "Beautiful description!" },
      { username: "Bob", text: "I love mornings like these." }
    ]
  },
  {
    postID: 4,
    username: "Tim",
    time: "17:16",
    description:
    "I want to post nothing here.\n Please go.",
    liked: false,
    likes: 1,
    commentnum: 1,
    comments: [
      { username: "Admin", text: "So rude!" },
    ]
  },
];

function UserPageTemplate({user}) {
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
      <div className={`popupBox ${state ? "show" : ""}`}>
        <div onClick={(e) => e.stopPropagation()}>
          <AddPostForm closeFunc={closeAddPost}/>
        </div>
      </div>

      <Header subTitle={user} currPage={"User Page"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={homeIcon}
            name={"Home"}
            color={"#1D67CD"}
            func = {()=>navigate('/userhomepage')}
          />
          <SideBarButton
            image={addPostIcon}
            name={"Add Post"}
            color={"black"}
            func = {()=>openAddPost()}
          />
          <SideBarButton
            image={searchIcon}
            name={"Search"}
            color={"black"}
            func = {()=>navigate('/userhomepage')}
          />
          <SideBarButton
            image={messageIcon}
            name={"Message"}
            color={"black"}
            func = {()=>navigate('/message')}
          />
          <SideBarButton
            image={notificationIcon}
            name={"Notification"}
            color={"black"}
            func = {()=>navigate(`/profile/${getCookie("userID")}`)}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"black"}
            func = {()=>navigate('/notification')}
          />
          <SideBarButton 
            image={logoutIcon}
            name={"Log out"}
            color={"black"}
            func = {() => navigate("/")}
          />
        </div>
        <div id="main">
          <UserHomepage posts={testPost} />
        </div>
      </div>
    </div>
  );
}

export default UserPageTemplate;
  
