/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import "./components.css";
import React from "react";
import "./format.css";
import crossIcon from "../assets/cross.svg";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { getCookie } from "./CookieHandlers";

const CheckNotification = async () => {
    const userID = getCookie("userID");
    const response = await fetch(`${API_BASE_URL}/api/user/getNotification`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ userID: userID })
    });
    if (response.status === 200) {
        const data = await response.json();
        //console.log("Notification:",data, data.length > 0);
        return (data.length > 0);
    }
    else {
        console.log("ERROR");
    }
}

const CheckUnreadMessages = async () => {
  const userID = getCookie("userID");
  const response = await fetch(`${API_BASE_URL}/api/user/checkUnreadMessages`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ userID: userID })
  });
  if (response.status === 200) {
      const data = await response.json();
      return (data);
  }
  else {
      console.log("ERROR");
  }
}
/*height: 180px, width: 1000px*/
function Header({ subTitle, currPage }) {
  return (
    <div id="headerContainer">
      <div>
        <h1>
          <b>SORU</b>
        </h1>
        <h5>{subTitle}</h5>
      </div>
      <div>
        <h2>{currPage}</h2>
      </div>
    </div>
  );
}

function SideBarButton({ image, name, color, func }) {
  return (
    <button type="button" className="sideBarButton" onClick={func}>
      <img src={image} alt="" width="33px" height="33px" />
      <p style={{ color: color }}>{name}</p>
    </button>
  );
}

function CrossButton({ func }) {
  return (
    <button type="button" id="crossButton" onClick={func}>
      <img src={crossIcon} alt="" width="40px" height="40px" />
    </button>
  );
}

export { Header, SideBarButton, CrossButton, CheckNotification, CheckUnreadMessages };
