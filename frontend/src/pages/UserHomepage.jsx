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
import { Header, SideBarButton, CheckNotification, CheckUnreadMessages } from "./components";
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;




function UserHomepageComponent({ posts, changeLike }) {  


  const renderPost = (object) => {

    return (
      <div className="post-container " key={object.post.postid}>
        {object.isrecommend && <div>Recommended Post</div>}
        <div className="post-header">
          <span className="post-username">{object.authorName}</span>
          <span className="post-time">{object.post.time}</span>
        </div>
        <div className="post-description">
          {object.post.content.split('\n').map((line, index) => (
            (index < 3 || object.post.content.split('\n').length <= 3) && (
              <p key={index}>{line}</p>
            )
          ))}
        </div>
        <div className="post-media">
          {object.post.mediauri !== "" && object.post.mediauri.endsWith('.mp4') ? (
            <video controls>
              <source src={object.post.mediauri} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <img src={object.post.mediauri} style={{ maxWidth: '500px', maxHeight: '350px', width: 'auto', height: 'auto' }} />
          )}
        </div>
        {object.post.content.split('\n').length > 3 && (
          <div className="read-more">
            <Link to={`/post/${object.post.postid}`}>Read More</Link>
          </div>
        )}
        <div className="interaction-buttons">
          <button className="like-button" onClick={(event) => changeLike(object.liked, object.post.postid, event)}>
            {object.liked ? <img src={likedIcon} alt="liked" /> : <img src={likeIcon} alt="like" />}
          </button>
          <p>{object.post.likes}</p>
          <Link to={`/post/${object.post.postid}`} className="comment-button"><img src={commentIcon} alt="comment" /></Link>
          <p>{object.comment.length}</p>
        </div>
        <div className="comments">
          {Array.isArray(object.comments) && object.comments.slice(0, 2).map((comment, index) => (
            <div className="comment" key={index}>
              <span className="comment-username"><b>{comment.username}</b></span>
              <span className="comment-text">{comment.text}</span>
            </div>
          ))}
        </div>
        {Array.isArray(object.comments) && object.comments.length > 2 && (
          <div className="view-all-comments">
            <Link to={`/post/${object.post.postID}`}>View all comments</Link>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="user-homepage">
      {posts.map((object) => renderPost(object))}
    </div>
  );
}

function UserHomepage() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);
  const [singlePost, setSinglePost] = useState([]);
  const [loading2, setLoading2] = useState(false);

  
  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  // console.log(user);
  const user = getCookie("username");
  const userID = getCookie("userID");

  const getFollowingPost = async (userID) => {
    const data = {
      userID: userID,
    };
    const response = await fetch(`${API_BASE_URL}/api/user/getFollowingPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    // console.log(response);
    if (response.status === 200) {
      const resdata = await response.json();
      const post1 = resdata.posts;
      const isrecommend = resdata.isrecommended;
      post1.forEach(post => {
        // Add isrecommend attribute to each post
        post.isrecommend = isrecommend;
    });
      console.log(post1);
      console.log("get following posts successful.");
      return post1;
    } else {
      const resdata = await response.json();
      console.log(resdata);
      console.log("fail to get following posts.");
      return [];
    }
  }

  const getPopularPost = async () => {

    const response = await fetch(`${API_BASE_URL}/api/user/getRecentPopularPosts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.status === 200) {
      const resdata = await response.json();
      console.log(resdata);
      const post1 = resdata.posts;
      console.log("get recent popular posts successful.");
      const isrecommend = resdata.isrecommended;
      post1.forEach(post => {
        // Add isrecommend attribute to each post
        post.isrecommend = isrecommend;
    });
      return post1;
    } else {
      const resdata = await response.json();
      console.log(resdata);
      console.log("fail to get recent popular posts.");
      return [];
    }
  }

  const getRecommendPosts = async (userID) => {
    const data = {
      userID: userID,
    };
    const response = await fetch(`${API_BASE_URL}/api/user/getRecommendedPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.json();
      const post1 = resdata.posts;
      const isrecommend = resdata.isrecommended;
      post1.forEach(post => {
        // Add isrecommend attribute to each post
        post.isrecommend = isrecommend;
    });
      console.log("get recommend posts successful.");
      return post1;
    } else {
      const resdata = await response.text();
      console.log(resdata);
      console.log("fail to get recommend posts.");
      const post1 = [];
      return post1;
    }
  }


  

  useEffect(() => {
    const getHomepagePost = async (userID) => {
      try{ 
        let postlist=[];
        
        const post1 = await getFollowingPost(userID);
        postlist = [...postlist, ...post1];

        const post2 = await getRecommendPosts(userID);
        postlist = [...postlist, ...post2];

        const post3 = await getPopularPost();
        postlist = [...postlist, ...post3];
        console.log(postlist);

        const allPosts = await Promise.all(postlist.map(async (post) => {
            const data = {
              postID: post.postid
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
              console.log(resdata);
              resdata.isrecommend = post.isrecommend;
              return resdata;
            }
        }));

        let uniquePosts = {};
        allPosts.forEach(post => {
          let postID = post.post.postid;
          if (!uniquePosts[postID]){
            uniquePosts[postID] = post;
          }
        })

        let uniquePostsArray = Object.values(uniquePosts).filter(Boolean);
        const reversedPosts = uniquePostsArray.reverse();
        reversedPosts.sort(() => Math.random()-0.5);
        setPost(reversedPosts);
        console.log(reversedPosts);
        setLoading(false);
    } catch (error) {
      console.error("Error in getHomepagePost:", error);
    }
  };

    getHomepagePost(userID);
  }, [userID]);

  
  const [notificationState, setNotificationState] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(false);

  const updateState = async () => {
    const result = await CheckNotification();
    setNotificationState(result);
    const result2 = await CheckUnreadMessages();
    setUnreadMessages(result2);
  };
  
  // useEffect(() => {
  //   updateState();
  //   const interval = setInterval(() => {
  //     updateState();
  //     console.log("unread messages", unreadMessages);
  //   }, 3000);
  //   return () => clearInterval(interval);
  // }, []);

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
              <div>Loading...</div>
            ) : (
              <UserHomepageComponent posts={post} changeLike={changeLike} />
            )}
        </div>
      </div>
    </div>
  );
}

export default UserHomepage;
