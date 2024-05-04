/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

// The fllowing codes are assisted by Chatgpt

import React, { useEffect, useState } from 'react';
import { Header, SideBarButton, CheckNotification, CheckUnreadMessages } from "./components";
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
import HomepagePostBox from './HomepagePostBox';
import './format.css'
import './Post.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;




function UserHomepageComponent({ userID, posts }) {    
  return (
    <div className="user-homepage">
      {posts.map((object) =>  <HomepagePostBox userID={userID} postID={object.post.postid} isrecommend={object.isrecommend}  />)}
    </div>
  );
}

function UserHomepage() {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);


  
  const openAddPost = () => {
    setState(true);
  };
  const closeAddPost = () => {
    setState(false);
  };
  // console.log(user);
  const user = getCookie("username");
  const userID = getCookie("userID");

  const getFollowingPost = async (userID) => {
    const data = {
      userID: userID,
    };
    const response = await fetch(`${API_BASE_URL}/api/user/getFollowingPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    // console.log(response);
    if (response.status === 200) {
      const resdata = await response.json();
      const post1 = resdata.posts;
      const isrecommend = resdata.isrecommended;
      post1.forEach(post => {
        // Add isrecommend attribute to each post
        post.isrecommend = isrecommend;
    });
      console.log(post1);
      console.log("get following posts successful.");
      return post1;
    } else {
      const resdata = await response.json();
      console.log(resdata);
      console.log("fail to get following posts.");
      return [];
    }
  }

  const getPopularPost = async () => {

    const response = await fetch(`${API_BASE_URL}/api/user/getRecentPopularPosts`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    if (response.status === 200) {
      const resdata = await response.json();
      console.log(resdata);
      const post1 = resdata.posts;
      console.log("get recent popular posts successful.");
      const isrecommend = resdata.isrecommended;
      post1.forEach(post => {
        // Add isrecommend attribute to each post
        post.isrecommend = isrecommend;
    });
      return post1;
    } else {
      const resdata = await response.json();
      console.log(resdata);
      console.log("fail to get recent popular posts.");
      return [];
    }
  }

  const getRecommendPosts = async (userID) => {
    const data = {
      userID: userID,
    };
    const response = await fetch(`${API_BASE_URL}/api/user/getRecommendedPosts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.status === 200) {
      const resdata = await response.json();
      const post1 = resdata.posts;
      const isrecommend = resdata.isrecommended;
      post1.forEach(post => {
        // Add isrecommend attribute to each post
        post.isrecommend = isrecommend;
    });
      console.log("get recommend posts successful.");
      return post1;
    } else {
      const resdata = await response.text();
      console.log(resdata);
      console.log("fail to get recommend posts.");
      const post1 = [];
      return post1;
    }
  }


  

  useEffect(() => {
    const getHomepagePost = async (userID) => {
      try{ 
        let postlist=[];
        
        const post1 = await getFollowingPost(userID);
        postlist = [...postlist, ...post1];

        const post2 = await getRecommendPosts(userID);
        postlist = [...postlist, ...post2];

        const post3 = await getPopularPost();
        postlist = [...postlist, ...post3];
        console.log(postlist);

        const allPosts = await Promise.all(postlist.map(async (post) => {
            const data = {
              postID: post.postid
            };

            const response = await fetch(`${API_BASE_URL}/getSinglePost`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(data)
            });
            if (response.status === 200) {
              const resdata = await response.json();
              console.log(resdata);
              resdata.isrecommend = post.isrecommend;
              return resdata;
            }
        }));

        let uniquePosts = {};
        allPosts.forEach(post => {
          let postID = post.post.postid;
          if (!uniquePosts[postID]){
            uniquePosts[postID] = post;
          }
        })

        let uniquePostsArray = Object.values(uniquePosts).filter(Boolean);
        const reversedPosts = uniquePostsArray.reverse();
        reversedPosts.sort(() => Math.random()-0.5);
        setPost(reversedPosts);
        console.log(reversedPosts);
        setLoading(false);
    } catch (error) {
      console.error("Error in getHomepagePost:", error);
    }
  };

    getHomepagePost(userID);
  }, [userID]);

  
  const [notificationState, setNotificationState] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(false);

  const updateState = async () => {
    const result = await CheckNotification();
    setNotificationState(result);
    const result2 = await CheckUnreadMessages();
    setUnreadMessages(result2);
  };
  
  useEffect(() => {
    updateState();
    const interval = setInterval(() => {
      updateState();
      console.log("unread messages", unreadMessages);
    }, 3000);
    return () => clearInterval(interval);
  }, []);



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
            color={unreadMessages ? "red" : "black"}
            func={() => navigate('/message')}
          />
          <SideBarButton
            image={notificationIcon}
            name={"Notification"}
            color={notificationState ? "red" : "black"}
            func={() => navigate('/notification')}
          />
          <SideBarButton
            image={profileIcon}
            name={"Profile"}
            color={"black"}
            func={() => navigate(`/profile/${getCookie("userID")}`)}
          />
          <SideBarButton
            image={logoutIcon}
            name={"Log out"}
            color={"black"}
            func={() => navigate("/")}
          />
        </div>
        <div id="main">
          {loading ? (
              <div>Loading...</div>
            ) : (
              <UserHomepageComponent userID={userID} posts={post}  />
            )}
        </div>
      </div>
    </div>
  );
}

export default UserHomepage;
