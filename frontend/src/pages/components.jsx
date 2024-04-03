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

function SideBarButton({ image, name, color }) {
  return (
    <button type="button" id="sideBarButton">
      <img src={image} alt="" width="33px" height="33px" />
      <p style={{ color: color }}>{name}</p>
    </button>
  );
}

export { Header, SideBarButton };
