/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */


import { Header, SideBarButton } from "./components";
import "./format.css";
import React, {useState} from "react";
import homeIcon from "../assets/home.svg";
import addPostIcon from "../assets/addPost.svg";
import searchIcon from "../assets/search.svg";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import profileIcon from "../assets/user.svg";
import { useParams } from 'react-router-dom';
import { BsHeartFill, BsHeart, BsChat } from 'react-icons/bs';
import './format.css'
import './SinglePost.css'; 


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


function AddPost({ user }) {
    return (
      <div id="addPost">
        <h1>{user.username}</h1>
      </div>
    );
}

function SinglePostFrame({ posts }) {
  
  if (!posts) {
    return (
        <div>Post not found!</div>
    )
  }

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
                <p key={index}>{line}</p>
            ))}
          </div>
          <div className="interaction-buttons">
            <button className="like-button">
              {post.liked ? <BsHeartFill style={{ color: 'red' }} /> : <BsHeart />}
            </button>
            <span className="like-count">{post.likes}</span>
            <button className="comment-button"><BsChat /></button>
            <span className="comment-count">{post.commentnum}</span>
          </div>
          <div className="comments">
            {post.comments.map((comment, index) => (
              <div className="comment" key={index}>
                <span className="comment-username">{comment.username}</span>
                <span className="comment-text">{comment.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="single-homepage">
      {posts.map((post) => renderPost(post))}
    </div>
  );
}

function SinglePostPage({ user }) {
  const [state, setState] = useState(false);
  const { postID } = useParams();
  const requiredpost = testPost.find((post) => post.postID === parseInt(postID));
  const post = [requiredpost];

  // for debugging.
//   console.log(requiredpost);
//   console.log(post);

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  return (
    <div>
      <div className={`popupBox ${state ? "show" : ""}`} onClick={closeAddPost}>
        <div onClick={(e) => e.stopPropagation()}>
          <AddPost user={user} />
        </div>
      </div>

      <Header subTitle={user.username} currPage={"User Page"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={homeIcon}
            name={"Home"}
            color={"#1D67CD"}
            func={() => alert("This should redirect to Home page.")}
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
            func={() => alert("This should redirect to Search page.")}
          />
          <SideBarButton
            image={messageIcon}
            name={"Message"}
            color={"black"}
            func={() => alert("This should redirect to Message page.")}
          />
          <SideBarButton
            image={notificationIcon}
            name={"Notification"}
            color={"black"}
            func={() => alert("This should redirect to Notification page.")}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"black"}
            func={() => alert("This should redirect to Profile page.")}
          />
        </div>
        <div id="main">
          <SinglePostFrame posts={post} />
        </div>
      </div>
    </div>
  );
}

export default SinglePostPage;