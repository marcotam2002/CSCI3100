/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

//todo: link "Soru" to main page
import "./AdminPostPanel.css";
import "./format.css";
import { Header, SideBarButton } from "./components";
import React, { useState } from "react";
import userIcon from "../assets/user.svg";
import postIcon from "../assets/post.svg";
import attachmentIcon from "../assets/attachment.svg";
import logoutIcon from "../assets/log-out.svg";
import commentIcon from "../assets/comment.svg";
import { useNavigate } from 'react-router';
import deleteIcon from "../assets/delete.svg";

/*Just for testing*/
const testPost = [
  {
    postID: 1,
    content:
      "Here’s a 200-word sentence that explores the intricacies of quantum entanglement, the mysterious phenomenon where particles become inextricably linked across vast distances, defying classical intuition and challenging our understanding of reality. Imagine two electrons, separated by light-years, yet instantaneously responding to changes in each other’s state. Their properties—spin, polarization, and momentum—become entangled, forming an ethereal connection transcending space and time. When one electron’s spin flips, its distant partner mirrors the change, as if they share a secret language beyond our grasp. Einstein famously called this “spooky action at a distance,” grappling with its implications. Quantum entanglement fuels cutting-edge technologies: quantum teleportation, secure communication via entangled photons, and quantum computing. Yet, paradoxes persist: Does information travel faster than light? Is there a hidden cosmic web binding entangled particles? We delve into quantum superposition, where particles exist in multiple states simultaneously, collapsing only upon observation. Schrödinger’s cat embodies this duality—alive and dead until observed. As we probe deeper, entanglement’s dance continues, revealing a universe woven with invisible threads, challenging our notions of separateness and beckoning us toward a reality stranger than fiction. 🌌🔮",
    authorID: 1,
    creationDate: "19700101",
    likes: 987,
  },
];
function PostTable({ posts, view }) {
  const deletePost = (post) => {
    window.confirm(`You should be able to delete post: postID:${post.postID}.`);
  };
  const viewPostComment = (post) => {
    window.confirm(`You should be able to view post: postID:${post.postID} comment.`);
  };
  const viewPostAttachment = (post) => {
    window.confirm(`You should be able to view post: postID:${post.postID} attachment.`);
  };
  
  return (
    <table id="postTable">
      <thead>
        <tr>
          <th>PostID</th>
          <th>Username</th>
          <th>Content</th>
          <th></th>
        </tr>
      </thead>
      {posts.map((post) => (
        <tbody key={post.postID}>
          <tr>
            <td>{post.postID}</td>
            <td>
              <p>ID:{post.authorID}</p>
            </td>
            <td>
              <div id="content">{post.content}</div>
            </td>
            <td id="postButton">
              <div style={{display:"flex"}}>
              <button type="button" id="viewAttachment" onClick={() => viewPostAttachment(post)}>
              <img src={attachmentIcon} alt="" width="30px" height="30px" />
              </button>
              <button type="button" id="viewComment" onClick={() => viewPostComment(post)}>
              <img src={commentIcon} alt="" width="30px" height="30px" />
              </button>
              <button type="button" id="deletePost" onClick={() => deletePost(post)}>
              <img src={deleteIcon} alt="" width="30px" height="30px" />
              </button>
              </div>
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}

function PostAttachment({ post }) {
  return (
    <div id="postAttachment">
      <h1>Waiting for post class</h1>
    </div>
  );
}

function AdminPostPanel() {
  const [state, setState] = useState(false);
  const [currPost, setCurrPost] = useState(testPost[0]);
  const navigate = useNavigate();

  const openPostDetail = (post) => {
    setState(true);
    setCurrPost(post);
  };
  const closePostDetail = () => {
    setState(false);
  };

  return (
    <div>
      <div
        className={`popupBox ${state ? "show" : ""}`}
        onClick={closePostDetail}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <PostAttachment post={currPost} />
        </div>
      </div>

      <Header subTitle={"Admin Panel"} currPage={"Post Manager"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={userIcon}
            name={"User Manager"}
            color={"black"}
            func={() => navigate('/admin/usermanager')}
          />
          <SideBarButton
            image={postIcon}
            name={"Post Manager"}
            color={"#1D67CD"}
            func={() => navigate('/admin/postmanager')}
          />
          <SideBarButton 
              image={logoutIcon}
              name={"Log out"}
              color={"black"}
              func = {() => navigate("/")}
            />
        </div>
        <div id="main">
          <PostTable posts={testPost} view={openPostDetail} />
        </div>
      </div>
    </div>
  );
}

export default AdminPostPanel;
