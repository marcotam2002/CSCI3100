/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { BsHeartFill, BsHeart, BsChat } from 'react-icons/bs';
import './format.css'
import './UserHomepage.css'; 

function UserHomepage({ posts }) {

  const renderPost = (post) => {
    return (
      <div className="post-container " key={post.postID}>
        <div className="post-subcontainer">
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
            <button className="like-button">
              {post.liked ? <BsHeartFill style={{ color: 'red' }} /> : <BsHeart />}
            </button>
            <span className="like-count">{post.likes}</span>
            <button className="comment-button"><BsChat /></button>
            <span className="comment-count">{post.commentnum}</span>
          </div>
          <div className="comments">
            {post.comments.slice(0, 2).map((comment, index) => (
              <div className="comment" key={index}>
                <span className="comment-username">{comment.username}</span>
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