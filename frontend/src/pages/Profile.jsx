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

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;


function ProfilePostComponent({ posts, changeLike }) {


  const renderPost = (post) => {

    return (
      <div className="post-container " key={post.postid}>
        <div className="post-header">
          <span className="post-username">{post.username}</span>
          <span className="post-time">{post.time}</span>
      </div>
        <div className="post-description">
          {post.content.split('\n').map((line, index) => (
            (index < 3 || post.description.split('\n').length <= 3) && (
              <p key={index}>{line}</p>
            )
          ))}
        </div>
        <div className="post-media">
          {post.mediauri !== "" && post.mediauri.endsWith('.mp4') ? (
            <video controls>
              <source src={post.mediauri} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={post.mediauri} style={{ maxWidth: '500px', maxHeight: '350px', width: 'auto', height: 'auto' }} />
          )}
        </div>
        {post.content.split('\n').length > 3 && (
          <div className="read-more">
            <Link to={`/post/${post.postid}`}>Read More</Link>
          </div>
        )}
        <div className="interaction-buttons">
          <button className="like-button" onClick={(event) => changeLike(post.liked, post.postid, event)}>
            {post.liked ? <img src={likedIcon} alt="liked" /> : <img src={likeIcon} alt="like" />}
          </button>
          <p>{post.likes}</p>
          <Link to={`/post/${post.postid}`} className="comment-button"><img src={commentIcon} alt="comment" /></Link>
          <p>{post.commentnum}</p>
        </div>
        {/* <div className="comments">
          {post.comments.slice(0, 2).map((comment, index) => (
            <div className="comment" key={index}>
              <span className="comment-username"><b>{comment.username}</b></span>
              <span className="comment-text">{comment.text}</span>
            </div>
          ))}
        </div> */}
        {/* {post.comments.length > 2 && (
          <div className="view-all-comments">
            <Link to={`/post/${post.postID}`}>View all comments</Link>
          </div>
        )} */}
      </div>
    );
  };

  return (
    <div className="user-homepage">
      {posts.map((post) => renderPost(post))}
    </div>
  );
}

function UserProfile({ openFunc, isCurrentUser, user, access, post, changeLike, isFollow }) {


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
        <button onClick={isCurrentUser ? editProfile : (isFollow ? unfollowUser : followUser)}>
          {isCurrentUser ? "Edit Profile" : (isFollow ? "Unfollow" : "Follow")}
        </button>
      </div>
      <div id="descriptionBox">
        {user && user.description.split('\n').map((line, index) => (<p key={index}>{line}</p>))}
      </div>

      {/* Row 4: Posts */}
      <div><h5>Posts</h5></div>
      {access ? (
              <div>You do not have the access to view this user's posts. Please follow this user to see more.</div>
            ) : (
              <ProfilePostComponent posts={post} changeLike={changeLike} />
            )}
    </div>
  )
}

function Profile(){
  const [state, setState] = useState(false);
  const [state2, setState2] = useState(false);
  const [post, setPost] = useState([]);
  const [access, setAccess] = useState(false);
  const navigate = useNavigate();
  const currentUser = getCookie("userID");
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [profileUser, setProfileUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(false);

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

  const getProfilePost = async () => {
      const data = {
        userID: currentUser,
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

        const updatedPosts = await Promise.all(resdata.result.map(async (post) => {
          const data2= {
            userID: post.authorid,
          };

          const response2 = await fetch(`${API_BASE_URL}/getUsername`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
          });
          if (response2.status === 200) {
            const userData = await response2.text();
            return {...post, username: userData};
          } else {
            console.log("System Error in getting username.");
            return post;
          }
        }))
        // console.log("updated Posts are" , updatedPosts);
        const reversedPosts = updatedPosts.reverse();
        setPost(reversedPosts);
      } else {
        const resdata = await response.json()
        console.log(resdata);
        console.log("System Error");
      }
  };

  const getUser = async(userID) => {
    const data = {
      targetUserID: userID,
      currentUserID: currentUser
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
      if (userID === currentUser) {
        setAccess(true);
      } else {
        const data2 = {
          targetuserID: userID,
          currentuserID: currentUser
        };
        const response2 = await fetch(`${API_BASE_URL}/api/checkfollowing`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data2)
        });
        if (response2.status === 200) {
          const resdata2 = await response2.text();
          if (resdata2 == "true") {
            setAccess(true);
          }
        } else {
          const resdata2 = await response2.text();
          console.log(resdata2);
          console.log("System Error in checking is following.");
        }
      }
      
      if (access) {
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
    getUser(userID);
  }, []);

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
      updateState();
      console.log("unread messages", unreadMessages);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const getSinglePost = async(postID) => {
    const data = {
      postID: postID,
      userID: userID,
    };
    const response = await fetch(`${API_BASE_URL}/getSinglePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.json();
      const singlePost = resdata.result;

      const data2 ={
        userID: singlePost.authorid,
      };

      const response2 = await fetch(`${API_BASE_URL}/getUsername`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data2)
        });

        if (response2.status === 200) {
          const userData = await response2.text();
          const updatedPost = {...singlePost, username: userData};
          setSinglePost(updatedPost);
          setLoading2(false);
        } else {
          console.log("System Error in getting username.");
          setLoading2(false);
          return singlePost;
        }
  } else {
    console.log("System Error in getting Single Post.");
    setLoading2(false);
  }
};

  const replacePost = (posts, singlePost) => {
    if (!posts || !singlePost) return posts;

    const updatedPosts = posts.map(post => {
      if (post.postID === singlePost.postID) {
        return singlePost;
      } else {
        return post;
      }
    });

    return updatedPosts;
  };

  const changeLike = async (liked, postID, event) => {
    event.preventDefault();
    const [type,setType] = useState("");
    if (liked){
      setType("unlike");
    } else {
      setType("like");
    }

    // for fetch part
    const data = {
      postID: postID,
      userID: userID,
      type: type
    };

    const response = await fetch(`${API_BASE_URL}/api/post/changelikepost`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      // successful update
      setLoading2(true);
      getSinglePost(postID);
      replacePost(post, singlePost);
      console.log("successful update")
    } else {
      // failed update
      console.log("failed to update")
    }
  };

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
            color={unreadMessages ? "red" : "black"}
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
        {loading ? (
              <div>Loading...</div>
            ) : (
              <UserProfile openFunc={openEditProfileForm} isCurrentUser={isCurrentUser} user={profileUser} access={access} post={post}  changeLike={changeLike}/>
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
