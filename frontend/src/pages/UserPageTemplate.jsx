/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

//todo: link "Soru" to main page
import "./UserPageTemplate.css";
import "./format.css";
import { Header, SideBarButton } from "./components";
import React, {useState} from "react";
import homeIcon from "../assets/home.svg";
import addPostIcon from "../assets/addPost.svg";
import searchIcon from "../assets/search.svg";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import profileIcon from "../assets/user.svg";
import UserHomepage from "./UserHomepage";

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

function AddPost({user}) {
  return (
    <div id="addPost">
        <h1>{user.username}</h1>
    </div>
  );
}

function UserPageTemplate({user}) {
  const [state, setState] = useState(false);
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
          <AddPost user={user}/>
        </div>
      </div>

      <Header subTitle={user.username} currPage={"User Page"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={homeIcon}
            name={"Home"}
            color={"#1D67CD"}
            func = {()=>alert("This should redirect to Home page.")}
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
            func = {()=>alert("This should redirect to Search page.")}
          />
          <SideBarButton
            image={messageIcon}
            name={"Message"}
            color={"black"}
            func = {()=>alert("This should redirect to Message page.")}
          />
          <SideBarButton
            image={notificationIcon}
            name={"Notification"}
            color={"black"}
            func = {()=>alert("This should redirect to Notification page.")}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"black"}
            func = {()=>alert("This should redirect to Profile page.")}
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