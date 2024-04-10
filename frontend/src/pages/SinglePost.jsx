/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */
// to do : update the getPost function (should only run in the outer layer, then pass as arg to the component layer.)


import { Header, SideBarButton, CheckNotification, CheckUnreadMessages } from "./components";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CommentRender({ comments }) {
  if (!comments) {
    return (<div></div>);
  }
  console.log(comments);

  const [commentList, setCommentList] = useState([]);

  const getCommentUserName = async () => {
    const storage = [];
    for (let i = 0; i < comments.length; i++) {
      const response = await fetch(`${API_BASE_URL}/getUsername`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userID: comments[i].authorid })
      });
      if (response.status === 200) {
        const resdata = await response.text();
        storage.push({ username: resdata, content: comments[i].content });
      } else {
        // system error
        console.log('Error:', resdata.message);
      }
    }
    setCommentList(storage);
  }

  useEffect(() => {getCommentUserName();}, []);

  return (
    <div className="comments">
      {commentList.map((comment, index) => (
        <div className="comment" key={index}>
          <span className="comment-username"><b>{comment.username}</b></span>
          <span className="comment-text">{comment.content}</span>
        </div>
      ))}
    </div>
  );

}

function SinglePostFrame({ user, post, ChangeLike }) {

  if (!post) {
    return (
      <div>Post not found!</div>
    )
  }
  console.log(post);
  const [newcomment, setNewComment] = useState("");
  const [singlePost, setSinglePost] = useState(post);

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
    if (response.status === 200) {
      // successful update
      getSinglePost();
      console.log("successful update")
    } else {
      // failed update
      console.log("failed to update")
    }
  }



  // const renderPost = (post) => {

  return (
    <div className="single-post" key={post.post.postid}>
      <div className="post-header">
        <span className="post-username">{post.authorName}</span>
        <span className="post-time">{post.post.time}</span>
      </div>
      <div className="post-description">
        {post.post.content.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
      <div className="post-media">
        {post.post.mediauri !== "" && post.post.mediauri.endsWith('.mp4') ? (
          <video controls>
            <source src={post.post.mediauri} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img src={post.post.mediauri} style={{ maxWidth: '500px', maxHeight: '350px', width: 'auto', height: 'auto' }} />
        )}
      </div>
      <div className="interaction-buttons">
        <button className="like-button" onClick={(event) => ChangeLike(post.liked, post.post.postid, event)}>
          {post.liked ? <img src={likedIcon} alt="liked" /> : <img src={likeIcon} alt="like" />}
        </button>
        <p>{post.post.likes}</p>
        <img src={commentIcon} alt="comment" /><p>{post.comment.length}</p>
      </div>
      <CommentRender comments={post.comment} />
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

  const getSinglePost = async (postID) => {
    const response = await fetch(`${API_BASE_URL}/getSinglePost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postID: postID, userID: userID })
    });
    if (response.status === 200) {
      const resdata = await response.json();
      setPost(resdata);
      setFound(true);
      setLoading(false);
    } else {
      console.log("System Error in getting Single Post.");
      setFound(false);
      setLoading(false);
    }
  };
  
  useEffect(() => {getSinglePost(postID);}, []);

  const changeLike = async (liked, postID, event) => {
    event.preventDefault();
    const [type, setType] = useState("");
    if (liked) {
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

  return (
    <div>
      <div className={`popupBox ${state ? "show" : ""}`}>
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
          {loading ? (
            <h3>Loading...</h3>
          ) : (
            <> {found ? (<SinglePostFrame user={user} post={post} ChangeLike={changeLike} />) : <h3>Post not found!</h3>} </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePostPage;