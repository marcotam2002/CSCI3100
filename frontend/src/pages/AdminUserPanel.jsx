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
const testUsers = [
  {
    userid: "0000001",
    username: 'FirstUser',
    salt: 'e9b2fe0aa5c9f351359557eb098e6ded',
    password: 'df48327d5c1ad56b58cb630bb557fba133b89353261c3e672cb7c5e1b3ebc332c3d9033035ac5ae6cb86866015748d816872274d0bdc3a3bd0ac7fb201b92408',
    secureqans: '123',
    privacy: 'public',
    description: "I don't know what to write here bruh.",
    active: true,
    usertype: 'user'
  },
  {
    userid: "0000002",
    username: 'Name',
    salt: 'e9b2fe0aa5c9f351359557eb098e6ded',
    password: 'df48327d5c1ad56b58cb630bb557fba133b89353261c3e672cb7c5e1b3ebc332c3d9033035ac5ae6cb86866015748d816872274d0bdc3a3bd0ac7fb201b92408',
    secureqans: '123',
    privacy: 'private',
    description: "This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.This is a description of the user. \n I want to write something here. In order to test the word wrap. \n I hope this is enough.",
    active: true,
    usertype: 'user'
  }
]

function UserTable({ users, view }) {
  const viewUser = (user) => {
    window.confirm(`You shoulb be able to view ${user.username} profile.`)
  }
  const deleteUser = (user) => {
    window.confirm(`You shoulb be able to delete ${user.username}.`)
  }

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
      <p>{user.description}</p>
      <h6><b>Post:  </b></h6>
      <div id="userPost"> <p>Maybe imply maybe not</p></div>{/* may do*/}
      <button type="button" id="userProfileClose" onClick={closePopup}>Close</button>
    </div>
  );
}

function AdminUserPanel() {

  const [state, setState] = useState(false);
  const [currUser, setCurrUser] = useState(testUsers[0]);
  const [user,setUser] = useState("");
  const navigate = useNavigate();

  const openUserProfile = (user) => {
    setState(true);
    setCurrUser(user);
  };
  const closeUserProfile = () => {
    setState(false);
  };

  useEffect(() => {
    const getAllUser = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/getAllUser`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          },
        });
        if (response.status === 200) {
          //successful get user data
          const resdata = await response.json();
          setUser(resdata);
        } else {
          console.log("SHIT");
        }
      } catch (error) {
        console.error("SHIT AGAIN", error);
      }
    }
    getAllUser();
  }, []);

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
              func = {() => navigate("/")}
            />
        </div>
        <div id="main">
          <UserTable users={user} view={openUserProfile} />
        </div>
      </div>
    </div>
  );
}

export default AdminUserPanel;
