/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */


//const cloudinary=require("cloudinary").v2
const express = require("express");
const cors = require("cors");
const AccountHandler = require('./accounthandler');
const AdminHandler = require('./adminhandler');
const UserHandler = require('./userhandler');
//const pool = require("./database")

/* cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
*/

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test",async(req, res)=>{
    res.json({message:"Hello!"});
});

app.post("/api/user/login", async(req, res)=>{
    console.log("Login request received")
    const accountHandler=new AccountHandler();
    const loginResult = await accountHandler.authenticateAccount(req.body.username, req.body.password);
    //console.log(loginResult)
    if(loginResult.success){
        console.log("Backend database confirmed user existence, Login Success");
        //console.log(loginResult.usertype);
        return res.status(200).send({role: loginResult.usertype, username: req.body.username, userID: loginResult.userID});
    }
    else if (loginResult.message=='Failed to authenticate account') {
        console.log(loginResult.message);
        delete accountHandler;
        return res.status(500).send({message:loginResult.message});
    } else {
        console.log(loginResult.message);
        delete accountHandler;
        return res.status(404).send({message:loginResult.message});
    } 
});

app.post("/api/user/register", async(req, res)=>{
    console.log("Registration request received")
    const accountHandler=new AccountHandler();
    const result = await accountHandler.createUser(req.body.username, req.body.password, req.body.secans);
    //console.log(result)
    if(result.success){
        console.log("User created successfully");
        delete accountHandler;
        return res.status(200).send();
    }
    else if(result.message=='Username already taken'){
        delete accountHandler;
        return res.status(403).send(result.message);
    }
    else {
        delete accountHandler;
        return res.status(500).send("System Error");}
});

app.post("/api/user/forgetpw", async(req, res)=>{
    console.log("Forget password request received")
    const userHandler=new UserHandler();
    const result = await userHandler.checkSecurityAnswer(req.body.username, req.body.securityAnswers);
    //console.log(result)
    if(result){
        console.log("Security Answer Correct");
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message:"Error checking answer"});
    }
});

app.put("/api/user/forgetpw/changepw", async(req, res)=>{
    console.log("change password request received")
    const userHandler=new UserHandler();
    const result = await userHandler.resetPassword(req.body.username, req.body.password);
    if(result.success){
        console.log("password changed")
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(403).send({message:result.message});}
});

app.post("/api/user/addpost", async(req, res)=>{
    console.log("Add Post request received")
    const userHandler=new UserHandler();
    const result = await userHandler.createPost(req.body.userID,req.body.description, req.body.fileURL);    //test without media first
    if(result.success){
        console.log("New Post added to database");
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

//Code below except admin Not yet tested
//Need to test with post exist inside database, api request for comment
app.put("/api/post/commentadd", async(req,res)=>{
    console.log("Add Comment request received")
    const userHandler=new UserHandler();
    const result = await userHandler.commentPost(req.body.userID, req.body.postID, req.body.comment);    
    if(result.success){
        console.log("User commented to a post");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})


app.put("/api/post/likepost", async(req,res)=>{
    console.log("Like Post request received")
    const userHandler=new UserHandler();
    const result = await userHandler.commentPost(req.body.userID, req.body.postID);    
    if(result.message=='User has already liked the post'){
        console.log("User has already liked the post");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})

app.post("/api/search", async(req,res)=>{
    console.log("Search request received")
    const userHandler = new UserHandler()
    if(req.body.searchType == "user"){
        const result = await userHandler.searchUser(req.body.keyword);
        if(result.success){
            console.log("Returning User Search Result");
            if(result.users.length==0){
                return res.status(200).send("No User Found")
            }
            else{
                var userlist=[];
                for(const userID of result.users){
                    const response = await userHandler.viewProfile(userID)
                    userlist.push({username: response[0], description: response[1]})
                }  //Attention!!!!!!!!!!!!!!!!!  Check the viewProfile function for return value check.
                return res.status(200).send(userlist);
            }
        }
        else return res.status(404).send({message: result.message});
    }
    if(req.body.searchType == "tag"){
        const result = await userHandler.searchByMessageTags(req.body.keyword);
        if(result.success){
            
            console.log("Returning MessageTags search Result");
            if(result.postIDs.length==0){
                return res.status(200).send("No Post Found")
            }
            else{
                var postlist=[];
                for(const postID of result.postIDs){
                    const response = await userHandler.getPost(postID)
                    postlist.push([response])
                }  //Attention!!!!!!!!!!!!!!!!!  Check the viewProfile function for return value check.
                return res.status(200).send(postlist);
            }
        }
        else return res.status(404).send({message: result.message});
    }
    if(req.body.searchType == "general"){
        const result = await userHandler.generalSearch(req.body.keyword);
        if(result.success){
            console.log("Returning general search Result");
            if(result.postIDs.length==0){
                return res.status(200).send("No Post Found")
            }
            else{
                var postlist=[];
                for(const postID of result.postIDs){
                    const response = await userHandler.getPost(postID)
                    postlist.push([response])
                }  //Attention!!!!!!!!!!!!!!!!!  Check the viewProfile function for return value check.
                return res.status(200).send(postlist);
            }
        }
        else return res.status(404).send({message: result.message});
    }
}) //attention!!!!!! Consider whether we will fetch the search result id in the backend first and return to the frontend, or frontend do one more api request to fetch the content

//Get user in Profile page
app.post("getUser", async(req,res)=>{
    console.log("getUser request received");
    const userHandler = new UserHandler();
    const result = userHandler.viewProfile(req.body.userID);
    if(result.success){
        console.log("Return User INFO");
        return res.status(200).send(result.user);
    }
    else return res.status(404).send({message: result.message});

})



//Edit Profile page
app.put("/profile/edit", async(req,res)=>{
    console.log("Profile Edit request received")
    const userHandler=new UserHandler();
    const result = await userHandler.editProfile(req.body.username, req.body.description, req.body.isPrivate);    //test without media first
    if(result.success){
        console.log(result.message);
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

/*
To do: 
1. like or unlike post (halfway) 1
2. Homepage posts fetching
4. Like Comment(on marking?)

Things may need:
1. view own profile request, and view other user request
2. Check if user has like certain post before
*/


app.get("/api/admin/getAllUser", async(req, res)=>{
    console.log("Get all user request received")
    const adminHandler= new AdminHandler();
    const result = await adminHandler.getAllUsers();
    if(result){
        console.log("All user fetched")
        return res.status(200).send(result);
    }
    else return res.status(404).send({message:"Error fetching users"});
})

app.post("/api/admin/getUser", async(req, res)=>{
    console.log("Get user request received")
    const adminHandler= new AdminHandler();
    const result = await adminHandler.getUser(req.body.userID);
    if(result){
        console.log("user fetched")
        return res.status(200).send(result);
    }
    else return res.status(404).send({message:"Error fetching user"});
})

app.get("/api/admin/getAllPost", async(req, res)=>{
    console.log("Get all post request received")
    const adminHandler= new AdminHandler();
    const result = await adminHandler.getAllPosts();
    if(result){
        console.log("All post fetched")
        return res.status(200).send(result);
    }
    else return res.status(404).send({message:"Error fetching posts"});
})

app.put("/api/admin/deleteUser", async(req,res)=>{
    console.log("Delete User request received")
    const adminHandler=new AdminHandler();
    const result = await adminHandler.deleteUser(req.body.userID);
    if(result.success){
        console.log("Successfully deleted user");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})

app.put("/api/admin/deletePost", async(req,res)=>{
    console.log("Delete Post request received")
    const adminHandler=new AdminHandler();
    const result = await adminHandler.deletePost(req.body.postID);
    if(result){
        console.log("Successfully deleted post");
        return res.status(200).send();
    }
    else return res.status(404).send();
})

//Need to test with post exist inside database, api request for comment
app.put("/api/post/commentadd", async(req,res)=>{
    console.log("Add Comment request received")
    const userHandler=new UserHandler();
    const result = await userHandler.commentPost(req.body.userID, req.body.postID, req.body.comment);    
    if(result.success){
        console.log("User commented to a post");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})

app.put("/api/post/likepost", async(req,res)=>{
    console.log("Like Post request received")
    const userHandler=new UserHandler();
    const result = await userHandler.commentPost(req.body.userID, req.body.postID);    
    if(result.message=='User has already liked the post'){
        console.log("User has already liked the post");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})

app.post("/getHomepagePost", async(req, res)=>{
    console.log("Get User Own Post request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.getOwnPosts();    //test without media first
    if(result.success){
        console.log("User own Post retrieved");
        delete userHandler;
        return res.status(200).send({result:result.posts});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

app.post("/getSinglePost", async(req, res)=>{
    console.log("Access single post request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getPost(req.body.postID);    //test without media first
    if(result){
        console.log("Post retrieved");
        delete userHandler;
        return res.status(200).send({result});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: "error retrieving post"});
    }
})

//follow user
//Question here: how can we obtain the userID of the user we want to follow?
app.post("/user/followuser", async(req, res)=>{
    console.log("follow user request received")
    const userHandler=new UserHandler();
    const result = await userHandler.followUser(req.body.targetuserID);   
    if(result.success){
        console.log("Follow Success");
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

app.post("/user/unfollowuser", async(req, res)=>{
    console.log("unfollow user request received")
    const userHandler=new UserHandler();
    const result = await userHandler.unfollowUser(req.body.targetuserID);   
    if(result.success){
        console.log("unFollow Success");
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})


//required input: userID, targetuserID
app.post("/chat", async(req,res)=>{
    console.log("View Chat request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.getMessagesWithUser(req.body.targetuserID);   
    if(result.success){
        console.log("Get Chat History Success");
        delete userHandler;
        return res.status(200).send({message:result.messages});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

app.put("/chat/add", async(req,res)=>{
    console.log("Send Message request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.sendMessage(req.body.receiverID, req.body.message);   
    if(result.success){
        console.log(result.message);
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

//new
//get notifcation of follower request
app.post("/notification", async(req,res)=>{
    console.log("fetching notication request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.getNotifications();   
    if(result.success){
        console.log(userHandler.message);
        delete userHandler;
        return res.status(200).send({notication: result.notifications});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})
//Accept follower request
app.post("/acceptfollowrequest", async(req,res)=>{
    console.log("accept follower request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.acceptFollowRequest(req.body.awaitAcceptFollowerID);   
    if(result.success){
        console.log(result.message);
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

app.get("/api/user/getRecommendedUsers", async(req, res)=>{
    console.log("User recommendation request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getRecommendedUsers();
    if(result.success){
        console.log(result);
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

app.get("api/user/getRecentPopularPosts", async(req, res)=>{
    console.log("Recent Popular Post request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getRecentPopularPosts();
    if(result.success){
        console.log(result);
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

app.get("/api/user/getRecommendedPosts", async(req, res)=>{
    console.log("Post recommendation request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getRecommendedPosts();
    if(result.success){
        console.log(result);
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

app.get("api/user/getFollowingPosts", async(req, res)=>{
    console.log("Following posts request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getFollowingPosts();
    if(result.success){
        console.log(result);
        delete userHandler;
        return res.status(200).send();
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})
//end
/*
app.get("/api/homepage", async(req,res)=>{
    console.log("Fetching post from server")
    const userHandler=new UserHandler();
    const result = await userHandler.getPost();    //??????? Do we have a function to get a bunch of posts to the homepage?
})*/

app.listen(5164,()=>{
    console.log("server started on localhost:5164");
});