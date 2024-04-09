/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */
// to do : update the getPost function (should only run in the outer layer, then pass as arg to the component layer.)


import { Header, SideBarButton, CheckNotification } from "./components";
import "./format.css";
import React, { useEffect, useState } from "react";
import homeIcon from "../assets/home.svg";
import addPostIcon from "../assets/addPost.svg";
import searchIcon from "../assets/search.svg";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import profileIcon from "../assets/user.svg";
import likeIcon from '../assets/like.svg';
import logoutIcon from "../assets/log-out.svg";
import likedIcon from '../assets/liked.svg';
import commentIcon from '../assets/comment.svg';
import { useNavigate } from 'react-router';
import { getCookie } from "./CookieHandlers";
import { useParams } from 'react-router-dom';
import AddPostForm from "./AddPostForm";
import './format.css';
import './Post.css';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;


function SinglePostFrame({ user, posts, ChangeLike }) {

  if (!posts) {
    return (
      <div>Post not found!</div>
    )
  }

  const [newcomment, setNewComment] = useState("");
  const [singlePost, setSinglePost] = useState(posts);

  const addComment = async (postID, event) => {
    event.preventDefault();
    // for debugging.
    // console.log("Submitted comment:", newcomment);
    setNewComment("");

    // for fetch part
    const data = {
      postID: postID,
      userID: userID,
      comment: newcomment,
    };

    const response = await fetch(`${API_BASE_URL}/post/commentadd`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200){
        // successful update
        getSinglePost();
        console.log("successful update")
    }else{
        // failed update
        console.log("failed to update")
    }
  }

  

  // const renderPost = (post) => {

    return (
      <div className="single-post" key={singlePost.postid}>
        <div className="post-header">
          <span className="post-username">{singlePost.username}</span>
          <span className="post-time">{singlePost.time}</span>
        </div>
        <div className="post-description">
          {singlePost.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>
        <div className="post-media">
          {singlePost.mediauri !== "" && singlePost.mediauri.endsWith('.mp4') ? (
            <video controls>
              <source src={singlePost.mediauri} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={singlePost.mediauri} />
          )}
        </div>
        <div className="interaction-buttons">
          <button className="like-button" onClick={(event) => ChangeLike(singlePost.liked, singlePost.postid, event)}>
            {singlePost.liked ? <img src={likedIcon} alt="liked" /> : <img src={likeIcon} alt="like" />}
          </button>
          <p>{singlePost.likes}</p>
          <img src={commentIcon} alt="comment" /><p>{singlePost.commentnum}</p>
        </div>
        {/* <div className="comments">
          {post.comments.map((comment, index) => (
            <div className="comment" key={index}>
              <span className="comment-username"><b>{comment.username}</b></span>
              <span className="comment-text">{comment.text}</span>
            </div>
          ))}
        </div> */}
        <div className="addcomments">
          <form onSubmit={(event) => addComment(singlePost.postid, event)}>
            <input
              type="text"
              placeholder="Leave your comments here"
              value={newcomment}
              onChange={(event) => setNewComment(event.target.value)}
              required // Require the input field
            />
            <button className="addcomments-btn" type="submit">Submit</button>
          </form>
        </div>
      </div>
    );
  // };

  // return (
  //   <div className="single-homepage">
  //     {posts.map((post) => renderPost(post))}
  //   </div>
  // );
}

function SinglePostPage() {
  const [state, setState] = useState(false);
  const { postID } = useParams();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const user = getCookie("username");
  const userID = getCookie("userID");

  const getSinglePost = async(postID) => {
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
          console.log(updatedPost);
          setPost(updatedPost);
          setFound(true);
          setLoading(false);
        } else {
          console.log("System Error in getting username.");
          return singlePost;
          setFound(true);
          setLoading(false);
        }
  } else {
    console.log("System Error in getting Single Post.");
    setFound(false);
    setLoading(false);
  }
}
  useEffect(() => {
    getSinglePost(postID);
  }, []);

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
      getSinglePost(postID);
      console.log("successful update")
    } else {
      // failed update
      console.log("failed to update")
    }
  };

  const navigate = useNavigate();

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };

  const [notificationState, setNotificationState] = useState(false);
  const updateNotificationState = async () => {
    const result = await CheckNotification();
    setNotificationState(result);
  };
  useEffect(() => {
    updateNotificationState();
    const interval = setInterval(() => {
      updateNotificationState();
    }, 5000);
    return () => clearInterval(interval);
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
            func = {() => navigate("/")}
          />
        </div>
        <div id="main">
        {loading ? (
              <div>Loading...</div>
            ) : (
              <> {found ? (<SinglePostFrame user={user} posts={post} ChangeLike={changeLike}  />) : <div>Post not found.</div>} </>
            )}
        </div>
      </div>
    </div>
  );
}

export default SinglePostPage;