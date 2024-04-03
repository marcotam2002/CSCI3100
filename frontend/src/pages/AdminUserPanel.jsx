/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

//todo: link "Soru" to main page
import './AdminUserPanel.css';
import "./format.css"
import {Header, SideBarButton} from "./components";
import React from "react";
import userIcon from "../assets/user.svg";
import postIcon from "../assets/post.svg";

function UserTable() {
  return (
    <table id="userTable">
    <tr>
      <th><h6>userID</h6></th>
      <th><h6>userID</h6></th>
      <th><h6>userID</h6></th>
    </tr>
    </table>
  );
}

function AdminUserPanel() {
  return (
    <body>
      <Header subTitle={"Admin Panel"} currPage={"User Manager"}/>
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton image={userIcon} name={"User Manager"} color={"#1D67CD"}/>
          <SideBarButton image={postIcon} name={"Post Manager"} color={"black"}/>
        </div>
        <div id="main">
          <UserTable/>
        </div>
      </div>
    </body>
  );
}

export default AdminUserPanel;