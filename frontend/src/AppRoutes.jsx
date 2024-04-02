import {Navigate, Route, Routes} from "react-router-dom";
import UserHomepage from "./pages/UserHomepage";
import SearchPage from "./pages/SearchPage";
import Login from "./pages/LoginPage"

const AppRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element = {<Login/>}/>
            <Route path="/search" element = {<SearchPage/>}/>
            <Route path="/homepage" element = {<UserHomepage/>}/>
        </Routes>
    );
};

export default AppRoutes;