/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import "./format.css";
import { Header, SideBarButton } from "./components";
import React, {useState,useEffect} from "react";
import {useParams} from "react-router-dom"
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

const testUser = 
    {
        userID: 2,
        username: "Peter",
        followersCount: 50,
        followingCount: 100,
        description: "Hi I \n am really \n happy."

    }

function UserProfile({openFunc}) {
    const { userID } = useParams();
    const currentUser = getCookie("userID");
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    useEffect(() =>{
        setIsCurrentUser(currentUser === userID);
    }, [userID, currentUser]);
    // setIsCurrentUser(true);
    
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
        <div>
            {/* Row 1: Username and Button */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                <div>{testUser && testUser.username}</div>
                <button onClick={isCurrentUser ? editProfile : followUser}>
                    {isCurrentUser ? "Edit Profile" : "Follow"}
                </button>
            </div>
            
            {/* Row 2: Followers and Following */}
            <div>{testUser && `${testUser.followersCount} followers | ${testUser.followingCount} following`}</div>
            
            {/* Row 3: User Description */}
            <div>{testUser && testUser.description}</div>
            
            {/* Row 4: Posts */}
            <div>Posts</div>
            
            {/* Row 5 and onwards: User's posts */}
            {/* {user && user.posts.map(post => (
                <div key={post.id}>{post.content}</div>
            ))} */}
        </div>
    )
}

function Profile({user}){
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);
  const navigate = useNavigate();

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
  console.log(user);
  return (
    <div>
      <div className={`popupBox ${state ? "show" : ""}`}>
        <div onClick={(e) => e.stopPropagation()}>
          <AddPostForm closeFunc={closeAddPost}/>
        </div>
      </div>
      <div className={`popupBox ${state2 ? "show" : ""}`}>
        <div onClick={(e) => e.stopPropagation()}>
          <EditProfileForm closeFunc={closeEditProfileForm}/>
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
            func = {()=>alert("This should redirect to Search page.")}
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
            func = {()=>alert("This should redirect to Notification page.")}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"black"}
            func = {()=>navigate(`/profile/${getCookie("userID")}`)}
          />
          <SideBarButton 
            image={logoutIcon}
            name={"Log out"}
            color={"black"}
            func = {() => navigate("/")}
          />
        </div>
        <div id="main">
          <UserProfile openFunc={openEditProfileForm}/>
        </div>
      </div>
    </div>
  );
}

export default Profile;
