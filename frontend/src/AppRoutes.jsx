import {Navigate, Route, Routes} from "react-router-dom";
import UserHomepage from "./pages/UserHomepage";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/LoginPage"
import AdminUserPanel from "./pages/AdminUserPanel";
import AdminPostPanel from "./pages/AdminPostPanel";
const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element = {<Login/>}/>
            <Route path="/search" element = {<SearchPage/>}/>
            <Route path="/homepage" element = {<UserHomepage/>}/>
            <Route path="/admin/usermanager" element = {<AdminUserPanel/>}/>
            <Route path="/admin/postmanager" element = {<AdminPostPanel/>}/>  
        </Routes>
    );
};

export default AppRoutes;