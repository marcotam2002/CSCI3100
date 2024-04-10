/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import "./format.css";
import './Post.css';
import React, { useEffect, useState } from "react";
import likeIcon from '../assets/like.svg';
import likedIcon from '../assets/liked.svg';
import commentIcon from '../assets/comment.svg';
import { Link } from 'react-router-dom';
import repostIcon from '../assets/repost.svg';
import { useNavigate } from 'react-router';


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;



function Post({ userID, postID, isrecommend }) {
    const [post, setPost] = useState({});
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
        // navigate(`/post/${postID}`);
      } else {
        // system error
        alert("You cannot repost this post!")
        console.log('Error:', resdata.message);
      }
    }
  
    useEffect(() => { getPost(); }, []);
    useEffect(() => { getCommentUserName(); }, [post]);
  
    if (loadingPost || loadingComment) {
      return (<h3>Loading...</h3>);
    }
    if (!found) {
      return (<h3>Post not found!</h3>);
    }
    return (
      <div className="post-container" key={post.post.postid}>
        {isrecommend && <div>Recommended Post</div>}
        <div className="post-header">
          <span className="post-username">{post.authorName}</span>
          <span className="post-time">{post.post.time}</span>
        </div>
        <div className="post-description">
          {post.post.content.split('\n').map((line, index) => (
          (index < 3 || post.post.content.split('\n').length <= 3) && (
            <p key={index}>{line}</p>
            )
          ))}
        </div>
        {post.post.mediauri != "" ? <p>to do</p> : null}
        {post.post.content.split('\n').length > 3 && (
          <div className="read-more">
            <Link to={`/post/${post.post.postid}`}>Read More</Link>
          </div>
        )}
        <div className="interaction-buttons">
          <button className="like-button" onClick={() => likePost()}>
            {post.liked ? <img src={likedIcon} alt="liked" /> : <img src={likeIcon} alt="like" />}
          </button>
          <p>{post.post.likes}</p>
          <Link to={`/post/${post.post.postid}`} className="comment-button">
          <img src={commentIcon} alt="comment" /></Link><p>{post.comment.length}</p>
          <button className="repost-button" onClick={() => rePost()}>
            <img src={repostIcon} alt="repost" />
          </button>
        </div>
        <div className="comments">
          {/* {commentList.map((comment, index) => (
            <div className="comment" key={index}>
              <span className="comment-username"><b>{comment.username}</b></span>
              <span className="comment-text">{comment.content}</span>
            </div>
          ))} */}
          {commentList.slice(0, 2).map((comment, index) => (
            <div className="comment" key={index}>
              <span className="comment-username"><b>{comment.username}</b></span>
              <span className="comment-text">{comment.content}</span>
            </div>
          ))}
          {commentList.length > 2 && (
            <div className="view-all-comments">
              <Link to={`/post/${post.post.postid}`}>View all comments</Link>
            </div>
          )}
        </div>
      </div>
    );
  
}
  
function HomepagePostBox({ userID, postID, isrecommend }) {
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
    useEffect(() => { checkIsRepost(); getUsername();}, []);
    if(isRepost){return(<div id="repostBox"><h6><b>{username}</b> Reposted</h6><div id="repost"><Post userID={userID} postID={repostID} isrecommend={isrecommend}/></div></div> )}
    else{return <Post userID={userID} postID={postID} isrecommend={isrecommend}/>;}
  }

export default HomepagePostBox;