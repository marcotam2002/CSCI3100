/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import likeIcon from '../assets/like.svg';
import likedIcon from '../assets/liked.svg';
import commentIcon from '../assets/comment.svg';
import './format.css'
import './Post.css';

function UserHomepage({ posts }) {

  const [postsState, setPostsState] = useState(posts);

  const ChangeLike = async (postID, event) => {
    event.preventDefault();

    // const updatedPosts = postsState.map((post) => {
    //   if (post.postID === postID) {
    //     post.liked = !post.liked;
    //     post.likes += post.liked ? 1 : -1;
    //   }
    //   return post;
    // });
    // setPostsState(updatedPosts);

    // for debugging.
    // console.log(updatedPosts);

    // for fetch part
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
      {posts.map((post) => renderPost(post))}
    </div>
  );
}

export default UserHomepage;