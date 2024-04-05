/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */

import {Navigate, Route, Routes} from "react-router-dom";
import UserHomepage from "./pages/UserHomepage";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/LoginPage"
import AdminUserPanel from "./pages/AdminUserPanel";
import AdminPostPanel from "./pages/AdminPostPanel";
import UserPageTemplate from "./pages/UserPageTemplate";
import ForgetPasswordForm from "./pages/ForgetPassword";

const testUser = {username: "testUser", password: "<PASSWORD>"};

const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element = {<Login/>}/>
            <Route path="/search" element = {<SearchPage/>}/>
            <Route path="/homepage" element = {<UserHomepage/>}/>
            <Route path="/admin/usermanager" element = {<AdminUserPanel/>}/>
            <Route path="/admin/postmanager" element = {<AdminPostPanel/>}/>  
            <Route path="/usertemplate" element = {<UserPageTemplate user={testUser}/>}/> 
            <Route path="/forgetpw" element= {<ForgetPasswordForm/>}/>
        </Routes>
    );
};

export default AppRoutes;