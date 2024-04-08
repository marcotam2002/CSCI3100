/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../assets/like.svg';
import likedIcon from '../assets/liked.svg';
import commentIcon from '../assets/comment.svg';
import { Header, SideBarButton } from "./components";
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
import './format.css'
import './Post.css';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;


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

function UserHomepageComponent({ posts }) {

  const [postsState, setPostsState] = useState(posts);
  const [singlePost, setSinglePost] = useState("");

  const getSinglePost = async() => {
    const data = {
      postID: postID,
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
      setSinglePost(resdata.post);
    } else {
      const resdata = await response.json();
      console.log(resdata);
      console.log("System Error in getting Single Post");
    }
  };

  const ChangeLike = async (postID, event) => {
    event.preventDefault();

    const data = {
      postID: postID,
      userID: userID,
    };

    const response = await fetch('/post/likepost', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      // successful update
      console.log("successful update")
      getSinglePost();
      const index = postsState.findIndex(item => item.postID === singlePost.postID);
      if (index !== -1) {
        postsState[index] = singlePost;
      } else {
        console.log("Post with postID", singlePost.postID, "not found in posts in Homepage.")
      }
    } else {
      // failed update
      console.log("failed to update")
    }
  };


  const renderPost = (post) => {
    return (
      <div className="post-container " key={post.postID}>
        <div className="post-header">
          <span className="post-username">{post.username}</span>
          <span className="post-time">{post.time}</span>
        </div>
        <div className="post-description">
          {post.description.split('\n').map((line, index) => (
            (index < 3 || post.description.split('\n').length <= 3) && (
              <p key={index}>{line}</p>
            )
          ))}
        </div>
        {post.description.split('\n').length > 3 && (
          <div className="read-more">
            <Link to={`/post/${post.postID}`}>Read More</Link>
          </div>
        )}
        <div className="interaction-buttons">
          <button className="like-button" onClick={(event) => ChangeLike(post.postID, event)}>
            {post.liked ? <img src={likedIcon} alt="liked" /> : <img src={likeIcon} alt="like" />}
          </button>
          <p>{post.likes}</p>
          <Link to={`/post/${post.postID}`} className="comment-button"><img src={commentIcon} alt="comment" /></Link>
          <p>{post.commentnum}</p>
        </div>
        <div className="comments">
          {post.comments.slice(0, 2).map((comment, index) => (
            <div className="comment" key={index}>
              <span className="comment-username"><b>{comment.username}</b></span>
              <span className="comment-text">{comment.text}</span>
            </div>
          ))}
        </div>
        {post.comments.length > 2 && (
          <div className="view-all-comments">
            <Link to={`/post/${post.postID}`}>View all comments</Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="user-homepage">
      {postsState.map((post) => renderPost(post))}
    </div>
  );
}

function UserHomepage() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState("");

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  // console.log(user);
  const user = getCookie("username");
  const userID = getCookie("userID");

  useEffect(() => {
    const getHomepagePost = async() => {
      try{
        const data = {
          userID: userID,
        };

        const response = await fetch(`${API_BASE_URL}/getHomepagePost`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
          });
          if (response.status === 200) {
            const resdata = await response.json();
            setPost(resdata.post);
          } else {
            const resdata = await response.json()
            console.log(resdata);
            console.log("System Error");
          }
        } catch (error) {
          console.log("Error in getting user homepage post. ");
        }
      };

    getHomepagePost();  
  }, []);


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
            func = {()=>navigate('/search')}
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
            func = {()=>navigate('/notification')}
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
          <UserHomepageComponent posts={testPost} />
        </div>
      </div>
    </div>
  );
}

export default UserHomepage;
