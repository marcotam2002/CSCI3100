/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import "./format.css";
import "./SearchPage.css";
import { Header, SideBarButton } from "./components";
import React, { useState } from "react";
import homeIcon from "../assets/home.svg";
import addPostIcon from "../assets/addPost.svg";
import searchIcon from "../assets/search.svg";
import messageIcon from "../assets/message.svg";
import notificationIcon from "../assets/notification.svg";
import profileIcon from "../assets/user.svg";
import logoutIcon from "../assets/log-out.svg";
import AddPostForm from './AddPostForm';
import { getCookie } from "./CookieHandlers";
import { useNavigate } from 'react-router';

const API_BASE_URL=import.meta.env.VITE_API_BASE_URL;


function UserSearch() {
  const [searchType, setSearchType] = useState("keyword");
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
  };

  const handleSearchTextChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const data = {
      searchType: searchType,
      searchText: searchText
    }

    const response = await fetch(`${API_BASE_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200){
      const resdata = await response.json();
      setSearchResults(resdata.result); 
    } else {
      // system error
      const resdata = await response.json()
      console.log(resdata);
    }
    // setSearchResults([
    //   { id: 1, name: "User 1" },
    //   { id: 2, name: "User 2" },
    //   { id: 3, name: "User 3" }
    // ]);
  };

  return (
    <div id="Search">
      <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={searchText}
            onChange={handleSearchTextChange}
            placeholder="Search..."
          />
          <label>
            <select value={searchType} onChange={handleSearchTypeChange}>
              <option value="keyword">Keyword</option>
              <option value="username">Username</option>
              <option value="tag">Tag</option>
            </select>
          </label>
          <button type="submit">Search!</button>
        <div>
        </div>
      </form>

      <div>
          {searchResults.length > 0 ? (
              <ul>
                  {searchResults.map(result => (
                      <li key={result.id}>{result.name}</li>
                  ))}
              </ul>
          ) : (
              <p>No results found</p>
          )}
      </div>
  </div>
    );
}

function SearchPage() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();

  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  const user = getCookie("username");
  return (
    <div>
      <div className={`popupBox ${state ? "show" : ""}`}>
        <div onClick={(e) => e.stopPropagation()}>
          <AddPostForm closeFunc={closeAddPost} />
        </div>
      </div>

      <Header subTitle={user} currPage={"User Page"} />
      <div id="bodyContainer">
        <div id="sideBar">
          <SideBarButton
            image={homeIcon}
            name={"Home"}
            color={"#1D67CD"}
            func={() => navigate('/userhomepage')}
          />
          <SideBarButton
            image={addPostIcon}
            name={"Add Post"}
            color={"black"}
            func={() => openAddPost()}
          />
          <SideBarButton
            image={searchIcon}
            name={"Search"}
            color={"black"}
            func={() => navigate('/search')}
          />
          <SideBarButton
            image={messageIcon}
            name={"Message"}
            color={"black"}
            func={() => navigate('/message')}
          />
          <SideBarButton
            image={notificationIcon}
            name={"Notification"}
            color={"black"}
            func={() => navigate(`/profile/${getCookie("userID")}`)}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"black"}
            func={() => navigate('/notification')}
          />
          <SideBarButton
            image={logoutIcon}
            name={"Log out"}
            color={"black"}
            func={() => navigate("/")}
          />
        </div>
        <div id="main">
          <UserSearch />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;