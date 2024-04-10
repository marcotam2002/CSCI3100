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
    if(req.body.fileURL){
        req.body.fileURL = encodeFileAsURL(req.body.fileURL);
    }
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
function encodeFileAsURL(FileURL){
    var fileReader = new FileReader();
    fileReader.onload = function(fileLoadedEvent){
        var base64URL = fileLoadedEvent.target.result;
        console.log(base64URL);
    }
    return fileReader.readAsDataURL(FileURL);
}
//following the second response from here: https://stackoverflow.com/questions/6150289/how-can-i-convert-an-image-into-base64-string-using-javascript

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


app.put("/api/post/changelikepost", async(req,res)=>{
    console.log("Like/Unlike Post request received")
    const userHandler=new UserHandler(req.body.id);
    if(req.body.type=="like"){
        const result = await userHandler.likePost(req.body.postID);
    }
    else{
        const result = await userHandler.unlikePost(req.body.postID);
    }    
    if(result.success){
        console.log(result.message);
        return res.status(200).send({message: result.message});
    }
    else return res.status(404).send({message: result.message});
})

app.post("/api/search", async(req,res)=>{
    console.log("Search request received")
    const userHandler = new UserHandler();
    if(req.body.searchType == "username"){
        const result = await userHandler.searchUser(req.body.searchText);
        if(result.success){
            console.log("Returning User Search Result");
            return res.status(200).send(result.users);
        }
        else return res.status(404).send({message: result.message});
    }
    if(req.body.searchType == "tag"){
        const result = await userHandler.searchByMessageTags(req.body.searchText);
        if(result.success){
            
            console.log("Returning MessageTags search Result");
            var postlist=[];
            if(result.postIDs.length!=0){
                for(const postID of result.postIDs){
                    const response = await userHandler.getPost(postID)
                    postlist.push(response)
                }  //Attention!!!!!!!!!!!!!!!!!  Check the viewProfile function for return value check.
            }
            return res.status(200).send(postlist);
        }
        else return res.status(404).send({message: result.message});
    }
    if(req.body.searchType == "general"){
        const result = await userHandler.generalSearch(req.body.searchText);
        if(result.success){
            console.log("Returning general search Result");
            var postlist=[];
            if(result.postIDs.length!=0){
                for(const postID of result.postIDs){
                    const response = await userHandler.getPost(postID)
                    postlist.push(response)
                }  //Attention!!!!!!!!!!!!!!!!!  Check the viewProfile function for return value check.
            }
            return res.status(200).send(postlist);
        }
        else return res.status(404).send({message: result.message});
    }
}) //attention!!!!!! Consider whether we will fetch the search result id in the backend first and return to the frontend, or frontend do one more api request to fetch the content

//Get user in Profile page
app.post("/getUsername", async(req,res)=>{
    console.log("getUser request received");
    const userHandler = new UserHandler();
    const result = await userHandler.getUsername(req.body.userID);
    if(result.success){
        console.log("Return User INFO");
        return res.status(200).send(result.username);
    }
    else return res.status(404).send({message: result.message});

})

//Edit Profile page
app.put("/api/profile/edit", async(req,res)=>{
    console.log("Profile Edit request received")
    const userHandler=new UserHandler(req.body.userID);
    const content = [req.body.username, req.body.description, req.body.isPrivate];
    const result = await userHandler.editProfile(content);    //test without media first
    if(result.success){
        // console.log(result.message);
        console.log("Success update profile");
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

app.post("/api/user/getFollowingUser", async(req, res)=>{
    console.log("Get following user request received");
    const userHandler = new UserHandler(req.body.userID);
    const result = await userHandler.getFollowing();
    delete userHandler;
    if(result){
        console.log("following user fetched")
        return res.status(200).send(result.following);
    }
    else return res.status(404).send({message:"Error fetching user"});
})

app.post("/api/user/getMutualFollowing", async(req, res)=>{
    console.log("Get mutual following request received");
    const userHandler = new UserHandler(req.body.userID);
    const result = await userHandler.getMutualFollowing();
    delete userHandler;
    if(result){
        console.log("mutual following user fetched");
        return res.status(200).send(result.mutualFollowing);
    }
    else return res.status(404).send({message:"Error fetching mutual user"});
})

app.post("/api/user/getUnreadMessages", async(req, res)=>{
    console.log("get unread messages request received")
    const userHandler = new UserHandler(req.body.userID);
    const result = await userHandler.GetUnreadMessages();
    delete userHandler;
    if(result){
        console.log("unread messages fetched")
        return res.status(200).send(result.unreadMessages);
    }
    else return res.status(404).send({message:"Error fetching unread messages"});
})

app.post("/api/user/checkUnreadMessages", async(req, res)=>{
    console.log("check unread messages request received")
    const userHandler = new UserHandler(req.body.userID);
    const result = await userHandler.CheckUnreadMessages();
    delete userHandler;
    if(result){
        console.log("unread messages situation fetched")
        return res.status(200).send(result.unread);
    }
    else return res.status(404).send({message:"Error fetching unread messages situation"});
})

app.get("/api/admin/getAllUser", async(req, res)=>{
    console.log("Get all user request received");
    const adminHandler= new AdminHandler();
    const result = await adminHandler.getAllUsers();
    delete adminHandler;
    if(result){
        console.log("All user fetched")
        return res.status(200).send(result);
    }
    else return res.status(404).send({message:"Error fetching users"});
})

app.post("/api/admin/getUser", async(req, res)=>{
    console.log("Get user request received")
    const adminHandler= new AdminHandler();
    delete adminHandler;
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
    delete adminHandler;
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
    delete adminHandler;
    if(result.success){
        console.log("Successfully deleted user");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})


app.put("/api/user/sendMessage", async(req,res)=>{
    console.log("send message request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.sendMessage(req.body.targetUserID, req.body.message);
    delete userHandler;
    if(result.success){
        console.log("Successfully send message");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})

app.put("/api/admin/deletePost", async(req,res)=>{
    console.log("Delete Post request received")
    const adminHandler=new AdminHandler();
    const result = await adminHandler.deletePost(req.body.postID);
    delete adminHandler;
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


app.post("/getOwnPost", async(req, res)=>{
    console.log("Get User Own Post request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.getOwnPosts();

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
    const userHandler=new UserHandler(req.body.userID);
    const post = await userHandler.getPost(req.body.postID);
    if(post)
    {
        const comment = await userHandler.getComment(req.body.postID);
        if(!comment.success)
        {
            delete userHandler;
            return res.status(404).send({message: "error retrieving comment"});
        }
        const liked = await userHandler.hasLikedPost(req.body.postID); 
        if(!liked.success)
        {
            delete userHandler;
            return res.status(404).send({message: "error retrieving like status"});
        }
        const authorName = await userHandler.getUsername(post.authorid);
        if(!authorName.success) 
        {
            delete userHandler;
            return res.status(404).send({message: "error retrieving authorname"});
        }  //test without media first
        console.log("Post retrieved");
        delete userHandler;
        return res.status(200).send({post:post, comment: comment.comments, liked:liked.liked, authorName: authorName.username});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: "error retrieving post"});
    }    
})

//follow user
//Question here: how can we obtain the userID of the user we want to follow?
app.post("/api/user/followuser", async(req, res)=>{
    console.log("follow user request received")
    const userHandler=new UserHandler(req.body.currentUserID);
    const result = await userHandler.followUser(req.body.targetUserID);
    if(result.success){
        console.log("Follow success");
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
    const userHandler=new UserHandler(req.body.currentUserID);
    const result = await userHandler.unfollowUser(req.body.targetUserID);   
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
app.post("/api/user/getMessage", async(req,res)=>{
    console.log("Get message request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.getMessagesWithUser(req.body.targetUserID);   
    if(result.success){
        console.log("Get message Success");
        delete userHandler;
        return res.status(200).send(result.messages);
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

//new
//get notifcation of follower request
app.post("/api/user/getNotification", async(req,res)=>{
    console.log("fetching notication request received")
    const userHandler=new UserHandler(req.body.userID);
    const requestResult = await userHandler.getNotifications();
    const recommendedResult = await userHandler.getRecommendedUsers();
    console.log(requestResult)
    console.log(recommendedResult)

    if(requestResult.success && recommendedResult.success){
        console.log(requestResult.message);
        console.log(recommendedResult.message);
        delete userHandler;
        return res.status(200).send({notifications: requestResult.notifications, recommendedUsers: recommendedResult.recommendedUserIDs});
    }
    else if(!requestResult.success){
        delete userHandler;
        return res.status(404).send({message: requestResult.message});
    } else {
        delete userHandler;
        return res.status(404).send({message: recommendedResult.message});
    }
})

//Accept follower request
app.post("/api/user/acceptFollowRequest", async(req,res)=>{
    console.log("accept follower request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.acceptFollowRequest(req.body.targetUserID); 
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

app.post("/api/user/rejectFollowRequest", async(req,res)=>{
    console.log("reject follower request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.rejectFollowRequest(req.body.targetUserID);   
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

app.post("/api/user/getRecommendedUsers", async(req, res)=>{
    console.log("User recommendation request received")
    const userHandler=new UserHandler(req.body.userID);
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

app.get("/api/user/getRecentPopularPosts", async(req, res)=>{
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

app.post("/api/user/getRecommendedPosts", async(req, res)=>{
    console.log("Post recommendation request received")
    const userHandler=new UserHandler(req.body.userID);
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

app.post("/api/user/getFollowingPosts", async(req, res)=>{
    console.log("Following posts request received")
    const userHandler=new UserHandler(req.body.userID);
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

app.post("/api/user/getUser", async(req,res)=>{
    console.log("Get User request received")
    const userHandler=new UserHandler(req.body.currentUserID);
    const targetuserProfile = await userHandler.viewProfile(req.body.targetUserID);
    const followers = await userHandler.getFollowers(req.body.targetUserID);
    const following = await userHandler.getFollowing(req.body.targetUserID);
    console.log("number of followers: " + followers.followers);
    if(targetuserProfile.success){
        delete userHandler;
        if (targetuserProfile.message === "Target user profile retrieved successfully") {
            return res.status(200).send({
                user:targetuserProfile.targetUser, 
                followersCount:followers.followers,
                followingCount:following.following,
            });
        };
        if (targetuserProfile.message === "User profile retrieved successfully" || targetuserProfile.message === "User is private") {
            return res.status(200).send({
                user:targetuserProfile.targetUser, 
                followersCount:followers.followers,
                followingCount:following.following,
                isFollowing: targetuserProfile.isFollowing,
            });
        }
        
    }
    else {
        delete userHandler;
        return res.status(404).send({message: targetuserProfile.message});
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