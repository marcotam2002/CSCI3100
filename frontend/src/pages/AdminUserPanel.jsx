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
import React, {useState} from "react";
import userIcon from "../assets/user.svg";
import postIcon from "../assets/post.svg";
/*Just for testing*/

const testUsers = [
  {
    userid: 1,
    username: 'FirstUser',
    salt: 'e9b2fe0aa5c9f351359557eb098e6ded',
    password: 'df48327d5c1ad56b58cb630bb557fba133b89353261c3e672cb7c5e1b3ebc332c3d9033035ac5ae6cb86866015748d816872274d0bdc3a3bd0ac7fb201b92408',
    secureqans: '123',
    privacy: 'public',
    description: "I don't know what to write here",
    active: true,
    usertype: 'user'
  }
]
function UserTable({ users, view }) {
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
            <button type="button" id="viewButton" onClick={()=>view(user)}>View</button>
              <button type="button" id="deleteButton" onClick={()=>deleteUser(user)}>Delete</button>
            </div>
          </td>
        </tr>
        </tbody>
      ))}
    </table>
  );
}

function UserProfile({user}) {
  return (
    <div id="userProfile">
        <h1>{user.username}</h1>
    </div>
  );
}

function AdminUserPanel() {

  const [state, setState] = useState(false);
  const [currUser, setCurrUser] = useState(testUsers[0]);
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
        <UserProfile user={currUser}/>
        </div>
      </div>

      <Header subTitle={"Admin Panel"} currPage={"User Manager"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={userIcon}
            name={"User Manager"}
            color={"#1D67CD"}
            func = {()=>alert("This should redirect to user manager.")}
          />
          <SideBarButton
            image={postIcon}
            name={"Post Manager"}
            color={"black"}
            func = {()=>alert("This should redirect to post manager.")}
          />
        </div>
        <div id="main">
          <UserTable users={testUsers} view={openUserProfile} />
        </div>
      </div>
    </div>
  );
}

export default AdminUserPanel;
