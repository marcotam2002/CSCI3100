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
import React, {useEffect, useState} from "react";
import userIcon from "../assets/user.svg";
import postIcon from "../assets/post.svg";

/*Just for testing*/
const testUsers = [
  { id: "0000001", username: "FirstUser", password: "<PASSWORD>" },
  { id: "0000002", username: "Name", password: "<PASSWORD>" },
  { id: "0000003", username: "zerozeroTHREE", password: "<PASSWORD>" },
  { id: "0000004", username: "IHATEPROJECT", password: "<PASSWORD>" },
];

function UserTable({ users, view }) {
  const viewUser = (user) => {
    window.confirm(`You shoulb be able to view ${user.username} profile.`)
  }
  const deleteUser = (user) => {
    window.confirm(`You shoulb be able to delete ${user.username}.`)
  }
  return (
    <table id="userTable">
      <tr>
        <th>UserID</th>
        <th>Username</th>
        <th>Action</th>
      </tr>
      {users.map((user) => (
        <tr key={user.id}>
          <td>{user.id}</td>
          <td>{user.username}</td>
          <td>
            <div id="actionButtons">
            <button type="button" id="viewButton" onClick={()=>view(user)}>View</button>
              <button type="button" id="deleteButton" onClick={()=>deleteUser(user)}>Delete</button>
            </div>
          </td>
        </tr>
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

  useEffect(() => {
    // Function to fetch user list
    const fetchUserList = async () => {
        try {
            // Send a GET request to retrieve user list
            const response = await fetch('/admin/userlist', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json'
              },
            });
            if (response.status === 200) {
                const userList = await response.json();
                console.log(userList); // Output the list of users (userID, username) for debug

                // save the arguments and pass them in the UserTable component

            } else {
                // If there's an error, log the error message
                const errorMessage = await response.text();
                console.error(errorMessage); // Log the error message
            }
        } catch (error) {
            console.error('Error fetching user list:', error);
        }
    };

    fetchUserList();
}, []); 

  return (
    <body>

      <div className={`popupBox ${state ? "show" : ""}`} onClick={closeUserProfile}>
        <UserProfile user={currUser}/>
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
    </body>
  );
}

export default AdminUserPanel;
