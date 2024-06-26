/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

//Part of the code is assisted by Github Copilot, Microsoft NewBing and chatgpt


import { Header, SideBarButton, CheckNotification, CheckUnreadMessages } from "./components";
import "./format.css";
import './Post.css';
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
import repostIcon from '../assets/repost.svg';
import { useNavigate } from 'react-router';
import { getCookie } from "./CookieHandlers";
import { useParams } from 'react-router-dom';
import AddPostForm from "./AddPostForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Post({ userID, postID, navigateFunc }) {
  const [post, setPost] = useState({});
  const [newcomment, setNewComment] = useState("");
  const [loadingPost, setLoadingPost] = useState(true);
  const [loadingComment, setLoadingComment] = useState(true);
  const [found, setFound] = useState(false);
  const [commentList, setCommentList] = useState([]);
  const navigate = useNavigate();

  const getCommentUserName = async () => {
    if (post.comment) {
      const storage = [];
      for (let i = 0; i < post.comment.length; i++) {
        const response = await fetch(`${API_BASE_URL}/getUsername`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userID: post.comment[i].authorid })
        });
        if (response.status === 200) {
          const resdata = await response.text();
          storage.push({ username: resdata, content: post.comment[i].content });
        } else {
          // system error
          console.log('Error:', resdata.message);
          setLoadingComment(false);
        }
      }
      setCommentList(storage);
      setLoadingComment(false);
    }
  }

  const getPost = async () => {
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
      setLoadingPost(false);
      setFound(true);
    } else {
      console.log("System Error in getting Single Post.");
      setLoadingPost(false);
    }
  };

  const addComment = async (event) => {
    event.preventDefault();
    console.log(newcomment);
    const response = await fetch(`${API_BASE_URL}/api/post/addComment`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userID: userID, postID: postID, comment: newcomment })
    });
    if (response.status === 200) {
      alert("Commented on this post!");
      getPost();
      setNewComment("");
    } else {
      // system error
      console.log('Error:', resdata.message);
    }
  }

  const likePost = async () => {
    const data = { userID: userID, postID: postID, type: post.liked };
    const response = await fetch(`${API_BASE_URL}/api/post/likePost`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      getPost();
    } else {
      console.log("System Error in liking Post.");
    }
  }

  const rePost = async () => {
    const response = await fetch(`${API_BASE_URL}/api/user/repost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({userID: userID,postID: postID})
    });
    if (response.status === 200) {
      const resdata = await response.json();
      const postID = resdata.postID;
      alert("Reposted");
      navigate(`/post/${postID}`);
    } else {
      // system error
      alert("You cannot repost this post!")
      console.log('Error:', resdata.message);
    }
  }

  useEffect(() => { setLoadingPost(true); setLoadingComment(true); getPost();}, []);
  useEffect(() => { getCommentUserName(); }, [post]);

  if (loadingPost || loadingComment) {
    return (<h3>Loading...</h3>);
  }
  if (!found) {
    return (<h3>Post not found!</h3>);
  }
  return (
    <div className="single-post" key={post.post.postid}>
      <div className="post-header">
        <span className="post-username">{post.authorName}</span>
        <span className="post-time">{post.post.time}</span>
      </div>
      <div className="post-description">
        {post.post.content.split('\n').map((line, index) => (<p key={index}>{line}</p>))}
      </div>
      {post.post.mediauri != "" ? <p><img src={post.post.mediauri} style={{maxHeight:700, maxWidth: 700, height:"auto", width: "auto"}}/></p> : null}
      <div className="interaction-buttons">
        <button className="like-button" onClick={() => likePost()}>
          {post.liked ? <img src={likedIcon} alt="liked" /> : <img src={likeIcon} alt="like" />}
        </button>
        <p>{post.post.likes}</p>
        <img src={commentIcon} alt="comment" /><p>{post.comment.length}</p>
        <button className="repost-button" onClick={() => rePost()}>
          
          <img src={repostIcon} alt="repost" />
        </button>
      </div>
      <div className="comments">
        {commentList.map((comment, index) => (
          <div className="comment" key={index}>
            <span className="comment-username"><b>{comment.username}</b></span>
            <span className="comment-text">{comment.content}</span>
          </div>
        ))}
      </div>
      <div className="addcomments">
        <form onSubmit={(event) => addComment(event)}>
          <input
            type="text"
            placeholder="Leave your comments here"
            value={newcomment}
            onChange={(event) => setNewComment(event.target.value)}
            required
          />
          <button className="addcomments-btn" type="submit">Submit</button>
        </form>
      </div>
    </div>
  );

}

function PostBox({ userID, postID, navigateFunc }) {
  const [isRepost, setIsRepost] = useState(false);
  const [username, setUsername] = useState("");
  const [repostID, setRepostID] = useState(0);

  const checkIsRepost = async () => {
    const response = await fetch(`${API_BASE_URL}/api/post/checkRepost`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postID: postID })
    });
    if (response.status === 200) {
      const resdata = await response.json();
      setIsRepost(resdata.isRepost);
      setRepostID(parseInt(resdata.content));
      console.log(resdata);
    } else {
      // system error
      console.log('Error:', resdata.message);
    }
  }
  
  const getUsername = async () => {
    const response = await fetch(`${API_BASE_URL}/api/post/getAuthorName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ postID: postID })
    });
    if (response.status === 200) {
      const resdata = await response.text();
      setUsername(resdata);
    } else {
      // system error
      console.log('Error:', resdata.message);
    }
  }


    // for fetch part
    // const data = {
    //   postID: postID,
    //   userID: userID,
    //   type: type
    // };

    // const response = await fetch(`${API_BASE_URL}/api/post/changelikepost`, {
    //   method: 'PUT',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(data)
    // });
    // if (response.status === 200) {
    //   // successful update
    //   getSinglePost(postID);
    //   console.log("successful update")
    // } else {
    //   // system error
    //   console.log('Error:', resdata.message);
    // }
  
  useEffect(() => { checkIsRepost(); getUsername();}, []);
  if(isRepost){return(<div id="repostBox"><h6><b>{username}</b> Reposted</h6><div id="repost"><Post userID={userID} postID={repostID} navigateFunc={navigateFunc} /></div></div> )}
  else{return <Post userID={userID} postID={postID} navigateFunc={navigateFunc}/>;}
}


function SinglePostPage() {
  const [state, setState] = useState(false);
  const { postID } = useParams();

  const user = getCookie("username");
  const userID = getCookie("userID");

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
    //updateState();
    const interval = setInterval(() => {
      //updateState();
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
          <PostBox userID={userID} postID={postID} navigateFunc={navigate}/>
        </div>
      </div>
    </div>
  );
}

export default SinglePostPage;
