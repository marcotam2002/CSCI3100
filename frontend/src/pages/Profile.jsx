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
import { Header, SideBarButton, CheckNotification, CheckUnreadMessages } from "./components";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProfilePostComponent({ posts, username, loading2, navigateFunc }) {

  if (loading2) {
    return <div>Loading...</div>
  }

  const renderPost = (post) => {
    // get post comment
    const postSplit = post.content.split('\n');
    const postContent = postSplit.length > 3 ? [postSplit[0], postSplit[1], postSplit[2], "..."] : postSplit;
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
  };

  const renderRepost = (post) => {
    return (
      <div id="repostCard" onClick={()=>navigateFunc(`/post/${post.postid}`)}>
          <div className="post-header">
            <span className="post-username">{username}</span>
            <span className="post-time">{post.time}</span>
          </div>
          <div className="post-description">
            <p>Reposted a post!</p>
          </div>
        </div>
    )
  }
  return (
    <div className="user-homepage">
      {posts.map((post) => post.isrepost ? renderRepost(post) : renderPost(post) )}
    </div>
  );
}

function UserProfile({ openFunc, isCurrentUser, user, access, post, isFollow, isPending, loading2, unfollowUser, followUser, followerNum, followingNum, navigateFunc }) {


  const editProfile = () => {
    // For debugging.
    openFunc();
    console.log("Edit Profile function placeholder");
  };

  return (
    <div id="profileBox">
      <div id="profileHeader">
        <h2><b>{user && user.username}</b></h2>
        <div id="followBox">
          <p><b>{user && followerNum}</b></p>
          <p> followers </p>
          <p><b>{user && followingNum}</b></p>
          <p> following </p>
        </div>
        {/* <button onClick={isCurrentUser ? editProfile : (isFollow ? unfollowUser : followUser)}>
          {isCurrentUser ? "Edit Profile" : (isFollow ? "Unfollow" : "Follow")}
        </button> */}
        {isCurrentUser ? (
            <button onClick={editProfile}>
              Edit Profile
            </button>
          ) : (
            isFollow ? (
              <button onClick={unfollowUser}>
                Unfollow
              </button>
            ) : (
              (user.privacy == 'private') ? (
                <button onClick={isPending ? unfollowUser : followUser}>
                  {isPending ? 'Requested' : 'Follow'}
                </button>
              ) : (
                <button onClick={isFollow ? unfollowUser : followUser}>
                  {isFollow ? 'Unfollow' : 'Follow'}
                </button>
              )
            )
          )
        }
      </div>
      <div id="descriptionBox">
        {user.description && user.description.split('\n').map((line, index) => (<p key={index}>{line}</p>))}
      </div>

      {/* Row 4: Posts */}
      <div><h5>Posts</h5></div>
      {access ? (<ProfilePostComponent posts={post} username={user.username} loading2={loading2} navigateFunc={navigateFunc}/>
      ) : (
        <p>You do not have the access to view this user's posts. Please follow this user to see more.</p>

      )}
    </div>
  )
}

function Profile() {
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);
  const [post, setPost] = useState([]);
  const [access, setAccess] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCookie("userID");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [isFollow, setIsFollow] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [profileUser, setProfileUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);
  const [followingNum, setFollowingNum] = useState("");
  const [followerNum, setFollowerNum] = useState("");

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

  const getProfilePost = async () => {
    const data = {
      userID: userID,
    };

    const response = await fetch(`${API_BASE_URL}/getOwnPost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.json();
      setPost(resdata.result.reverse());
          return {post: post, username: profileUser.username };
    } else {
      const resdata = await response.json()
      console.log(resdata);
      console.log("System Error");
    }
  };

  const getPending = async (userID) => {
    const data = {
      targetUserID: userID,
      currentUserID: currentUser
    };
    const response = await fetch(`${API_BASE_URL}/api/user/checkFollowRequest`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200){
      const resdata = await response.json();
      console.log('Pending: ' + resdata.isPending);
      setIsPending(resdata.isPending);
    } else {
      const resdata = await response.json()
      console.log(resdata);
      console.log("System Error in getting check pending qequest.");
    }
  }

  const getUser = async (userID) => {
    const data = {
      targetUserID: userID,
      currentUserID: currentUser
    };
    const response = await fetch(`${API_BASE_URL}/api/user/getUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.json();
      setProfileUser(resdata.user);
      setIsFollow(resdata.isFollowing)
      setFollowerNum(resdata.followersCount);
      setFollowingNum(resdata.followingCount);
      if (userID == currentUser || resdata.user.privacy == "public" || resdata.isFollowing == true) {
        setAccess(true);
        getProfilePost();
      }
      setLoading(false);
    } else {
      const resdata = await response.json()
      console.log(resdata);
      console.log("System Error in getting User Profile.");
    }
  }

  useEffect(() => {
    setLoading(true);
    getUser(userID);
    getPending(userID);
  }, [userID]);

  useEffect(() => {
    setIsCurrentUser(currentUser === userID);
  }, [userID, currentUser]);

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
      // updateState();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const followUser = async () => {
    const data = {
      targetUserID: userID,
      currentUserID: currentUser
    };
    const response = await fetch(`${API_BASE_URL}/api/user/followUser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.text();
      console.log(resdata);
      console.log("Follow user request sent.");
      getUser(userID);
      getPending(userID);
    } else {
      const resdata = await response.text();
      console.log("System Error in sending follow user request");
    }
  }

  const unFollowUser = async () => {
    const data = {
      targetUserID: userID,
      currentUserID: currentUser
    };
    const response = await fetch(`${API_BASE_URL}/api/user/unfollowuser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.text();
      console.log(resdata);
      console.log("Unfollow user request sent.");
      getUser(userID);
      getPending(userID);
    } else {
      const resdata = await response.text();
      console.log("System Error in sending follow user request");
    }
  }

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
            originUserName={profileUser.username}
            originDescription={profileUser.description}
            originPrivacy={profileUser.privacy === "private"} />
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
            color={notificationState ? "red" : "black"}
            func={() => navigate('/notification')}
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
          {loading ? (
            <div>Loading...</div>
          ) : (
            <UserProfile openFunc={openEditProfileForm} isCurrentUser={isCurrentUser} user={profileUser} access={access} post={post} isFollow={isFollow} isPending={isPending} loading2={loading2} unfollowUser={unFollowUser} followUser={followUser} followerNum={followerNum} followingNum={followingNum} navigateFunc={navigate} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
