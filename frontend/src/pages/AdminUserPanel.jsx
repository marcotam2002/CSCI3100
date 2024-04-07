/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

//todo: link "Soru" to main page
import "./AdminUserPanel.css";
import "./format.css";
import { Header, SideBarButton } from "./components";
import React, { useEffect, useState } from "react";
import userIcon from "../assets/user.svg";
import postIcon from "../assets/post.svg";
import logoutIcon from "../assets/log-out.svg";
import { useNavigate } from 'react-router';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
/*Just for testing*/

function UserTable({ users, view, deleteUser }) {
  return (
    <table id="userTable">
      <thead>
        <tr>
          <th>UserID</th>
          <th>Username</th>
          <th>Action</th>
        </tr>
      </thead>
      {users.map((user) => (
        <tbody key={user.userid}>
          <tr>
            <td>{user.userid}</td>
            <td>{user.username}</td>
            <td>
              <div id="actionButtons">
                <button type="button" id="viewButton" onClick={() => view(user)}>View</button>
                <button type="button" id="deleteButton" onClick={() => deleteUser(user)}>Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      ))}
    </table>
  );
}

function UserProfile({ user, closePopup }) {
  return (
    <div id="userProfile">
      <h3>{user.username}</h3>
      <h6><b>Privacy: </b>{user.privacy}</h6>
      <h6><b>Description:</b></h6>
      <div id="userDescription">
        {user.description && user.description.split('\n').map((line, index) => (<p key={index}>{line}</p>))}
      </div>
      <button type="button" id="userProfileClose" onClick={closePopup}>Close</button>
    </div>
  );
}

function AdminUserPanel() {


  const getAllUser = async () => {
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const deleteUser = async (user) => {
    const data = { userID: user.userid };
    const response = await fetch(`${API_BASE_URL}/api/admin/deleteUser`, {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      console.log("SUCCESSFUL DELETE USER");
      getAllUser();
    } else {
      console.log("ERROR");
    }
  };

  const [userList, setUserList] = useState([]);
  useEffect(() => { getAllUser(); }, []);
  const [state, setState] = useState(false);
  const [currUser, setCurrUser] = useState([userList[0]]);
  const navigate = useNavigate();

  const openUserProfile = (user) => {
    setState(true);
    setCurrUser(user);
  };
  const closeUserProfile = () => {
    setState(false);
  };

  return (
    <div>

      <div className={`popupBox ${state ? "show" : ""}`} onClick={closeUserProfile}>
        <div onClick={e => e.stopPropagation()}>
          <UserProfile user={currUser} closePopup={closeUserProfile} />
        </div>
      </div>

      <Header subTitle={"Admin Panel"} currPage={"User Manager"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={userIcon}
            name={"User Manager"}
            color={"#1D67CD"}
            func={() => navigate('/admin/usermanager')}
          />
          <SideBarButton
            image={postIcon}
            name={"Post Manager"}
            color={"black"}
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
          <UserTable users={userList} view={openUserProfile} deleteUser={deleteUser} />
        </div>
      </div>
    </div>
  );
}

export default AdminUserPanel;
