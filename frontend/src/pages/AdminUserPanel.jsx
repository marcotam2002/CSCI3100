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
            func={() => alert("This should redirect to user manager.")}
          />
          <SideBarButton
            image={postIcon}
            name={"Post Manager"}
            color={"black"}
            func={() => alert("This should redirect to post manager.")}
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
