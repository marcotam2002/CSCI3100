/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import {Navigate, Route, Routes} from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/LoginPage"
import AdminUserPanel from "./pages/AdminUserPanel";
import AdminPostPanel from "./pages/AdminPostPanel";
import UserPageTemplate from "./pages/UserPageTemplate";
import ForgetPasswordForm from "./pages/ForgetPassword";
import Message from "./pages/MessagePage";
import SinglePostPage from "./pages/SinglePost";
import { getCookie } from "./pages/CookieHandlers";
import Profile from "./pages/Profile";
import NotificationPage from "./pages/NotificationPage";

const testUser = {username: "testUser", password: "<PASSWORD>"};

const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element = {<Login/>}/>
            <Route path="/search" element = {<SearchPage/>}/>
            <Route path="/admin/usermanager" element = {<AdminUserPanel/>}/>
            <Route path="/admin/postmanager" element = {<AdminPostPanel/>}/>  
            <Route path="/userhomepage" element = {<UserPageTemplate user={getCookie("username")}/>}/> 
            <Route path="/forgetpw" element= {<ForgetPasswordForm/>}/>
            <Route path="/message" element = {<Message user={getCookie("username")}/>}/>
            <Route path="/post/:postID" element = {<SinglePostPage user={getCookie("username")}/>} />
            <Route path="/profile/:userID" element = {<Profile user={getCookie("username")}/> } />
            <Route path="/notification" element = {<NotificationPage />} />
        </Routes>
    );
};

export default AppRoutes;