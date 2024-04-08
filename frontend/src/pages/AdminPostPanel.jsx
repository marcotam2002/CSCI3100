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
import React, { useEffect, useState } from "react";
import userIcon from "../assets/user.svg";
import postIcon from "../assets/post.svg";
import logoutIcon from "../assets/log-out.svg";
import { useNavigate } from 'react-router';
import deleteIcon from "../assets/delete.svg";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function PostTable({ posts, deletePost, users}) {
  return (
    <table id="postTable">
      <thead>
        <tr key="postTableHead">
          <th>PostID</th>
          <th>Username</th>
          <th>Content</th>
          <th>Privacy</th>
          <th>Likes</th>
          <th>Time</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
      {posts.map((post) => (
          <tr key={post.postid}>
            <td>{post.postid}</td>
            <td>
              {users[post.authorid]}
            </td>
            <td>
              <div id="content">{post.content}</div>
            </td>
            <td>{post.privacy}</td>
            <td>{post.likes}</td>
            <td>{post.time}</td>
            <td id="postButton">
              <div style={{ display: "flex" }}>
                <button type="button" id="deletePost" onClick={() => deletePost(post)}>
                  <img src={deleteIcon} alt="" width="30px" height="30px" />
                </button>
              </div>
            </td>
          </tr>
      ))}
      </tbody>
    </table>
  );
}

function AdminPostPanel() {

  const getAllPost = async () => {
    const response = await fetch(`${API_BASE_URL}/api/admin/getAllPost`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      //successful get user data
      const resdata = await response.json();
      setPostList(resdata);
    } else {
      console.log("ERROR");
    }
  };

  const deletePost = async (post) => {
    const data = { postID: post.postid };
    const response = await fetch(`${API_BASE_URL}/api/admin/deletePost`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      console.log("SUCCESSFUL DELETE POST");
      getAllPost();
    } else {
      console.log("ERROR");
    }
  };
  
  const getAllUser = async () => {

    const response = await fetch(`${API_BASE_URL}/api/admin/getAllUser`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (response.status === 200) {
      //successful get user data
      const resdata = await response.json();
      setUserList(resdata);
    } else {
      console.log("ERROR");
    }
  };

  const [postList, setPostList] = useState([]);
  const [userList, setUserList] = useState([]);
  const users = {};
  useEffect(() => { getAllPost();getAllUser();}, []);
  const navigate = useNavigate();
  for(let i = 0; i < userList.length; i++){
    users[userList[i].userid] = userList[i].username;
  }

  return (
    <div>
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
            func={() => navigate("/")}
          />
        </div>
        <div id="main">
          <PostTable posts={postList} deletePost={deletePost} users={users}/>
        </div>
      </div>
    </div>
  );
}

export default AdminPostPanel;
