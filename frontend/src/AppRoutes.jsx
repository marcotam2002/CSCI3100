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
import ForgetPasswordForm from "./pages/ForgetPassword";

const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element = {<Login/>}/>
            <Route path="/search" element = {<SearchPage/>}/>
            <Route path="/homepage" element = {<UserHomepage/>}/>
            <Route path="/admin/userlist" element = {<AdminUserPanel/>}/>
            <Route path="/forgetpw" element= {<ForgetPasswordForm/>}/>
        </Routes>
    );
};

export default AppRoutes;