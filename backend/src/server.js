/*
 * Group members:
 * Tam King Man 1155160072
 * Tsang Ho Yin 1155159307
 * Ng Yuk Fung 1155176966
 * Leung Ka Lun 1155157403
 * O Ching Lam 1155159131
 */



const express = require("express");
const cors = require("cors");
const AccountHandler = require('./accounthandler');
const AdminHandler = require('./adminhandler');
const UserHandler = require('./userhandler');

const multer = require('multer');
const fs = require('fs');

//const pool = require("./database")



const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static('public'));

app.get("/test",async(req, res)=>{
    res.json({message:"Hello!"});
});


//User Login api call
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

//User Registration call
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


//Forget password security answer
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


//Password api will be called upon answering correct security answer
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

// npm install multer --save
//var upload = multer({dest: "public/images/uploads"})
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public')
    },
    filename: function (req,file, cb){
        cb(null, file.filename + '-' + Date.now())
    }
})
const upload = multer({storage: storage})

//Post upload function
app.post("/api/user/addpost", upload.single("fileURL"), async(req, res)=>{
    console.log("Add Post request received")
    console.log(req.file)
    var filepath = null;
    if(req.file){
        let newPath = `public/${
            req.file.originalname
            .substring(0, req.file.originalname.lastIndexOf("."))
            +'-'+Date.now()
            +"."
            +req.body.fileType}`
        fs.rename(req.file.path, newPath, ()=>{
            console.log("image uploaded successful")
        })
        //filepath = "../../../backend/"+newPath;
        filepath = "http://localhost:5164/"+newPath.replace("public/","");    //Attention: In case markers want to change the backend server address, be sure to change this link.
        console.log(filepath)
    }
    const userHandler = new UserHandler();
    const result = await userHandler.createPost(req.body.userID,req.body.description, filepath);
       
    if(result.success){
        console.log("New Post added to database");
        delete userHandler;
        return res.status(200).send({postID: result.postID});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})
//User repost a post api request
app.post("/api/user/repost", async(req, res)=>{
    console.log("Repost request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.repostPost(req.body.postID);
    console.log(result)    //test without media first
    if(result.success){
        console.log("repost successs");
        delete userHandler;
        return res.status(200).send({postID: result.postID});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})

//comment api request
app.put("/api/post/addComment", async(req,res)=>{
    console.log("Add Comment request received")
    const userHandler=new UserHandler(req.body.userID);
    console.log(req.body.comment);
    const result = await userHandler.commentPost(req.body.postID, req.body.comment);    
    if(result.success){
        console.log("User commented to a post");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})

//Like post request
app.put("/api/post/likePost", async(req,res)=>{
    console.log("Like/Unlike Post request received")
    const userHandler=new UserHandler(req.body.userID);
    if(req.body.type){
        const result = await userHandler.unlikePost(req.body.postID);
        if(result.success){
            console.log(result.message);
            return res.status(200).send({message: result.message});
        }
        else return res.status(404).send({message: result.message});
    }
    else{
        const result = await userHandler.likePost(req.body.postID);
        if(result.success){
            console.log(result.message);
            return res.status(200).send({message: result.message});
        }
        else return res.status(404).send({message: result.message});
    }
})

//Search request into the post database, return list of posts related according to search type of "tag", "username" or "general search"
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
}) 

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
    const result = await userHandler.editProfile(content);    
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


//Retrieve following user number from the database
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

//For use in user recommendation by getting mutual following users.
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

//Message box api calls
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

//Api requests solely for Admin User, ordinary user has no access to the api calls.
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

//api call to server to update chatbox whenever user send a message.
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


//api request for comment
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
//Check if this post is repost for frontend to render in different way.
app.post("/api/post/checkRepost", async(req,res)=>{
    console.log("Check Repost request received")
    const userHandler=new UserHandler();
    const result = await userHandler.checkRepost(req.body.postID);    
    if(result.success){
        if(result.isRepost){
            const result2 = await userHandler.getPost(req.body.postID);
            delete userHandler;
            return res.status(200).send({isRepost:result.isRepost,content:result2.content});
        }
        else{
            delete userHandler;
            return res.status(200).send({isRepost:result.isRepost,content:null});
        }
        
    }
    else return res.status(404).send({message: result.message});
})
//Get Author from the post for frontend rendering in post
app.post("/api/post/getAuthorName", async(req,res)=>{
    console.log("Get Author Name request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getPost(req.body.postID); 
    const result2 = await userHandler.getUsername(result.authorid);
    if(result2.success){
        return res.status(200).send(result2.username);
    }
    else return res.status(404).send({message: result.message});
})
//Get post posted by the user for Profile page post posted.
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
//get comment from the database whenever clicking into one post.
app.post("/api/post/getComment", async(req, res)=>{
    console.log("Get post comment request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getComment(req.body.postID);
    if(result.success){
        console.log("Post comment retrieved");
        delete userHandler;
        return res.status(200).send(result.comments);
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})
//Api call to get the related info of a post whenever user click into one post.
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

//follow user api request
app.post("/api/user/followUser", async(req, res)=>{
    console.log("follow user request received")
    const userHandler=new UserHandler(req.body.currentUserID);
    const result = await userHandler.followUser(req.body.targetUserID);
    console.log(result);
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
//Unfollow a user upon following
app.post("/api/user/unfollowuser", async(req, res)=>{
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

// pass if the user has pending request to target user, privacy mode support
app.post("/api/user/checkFollowRequest", async(req, res)=>{
    console.log("check pending follow request")
    const userHandler=new UserHandler(req.body.currentUserID);
    const result = await userHandler.hasPendingFollowRequest(req.body.targetUserID);   
    if(result.success){
        console.log("Checking Success");
        delete userHandler;
        return res.status(200).send({isPending: result.isPending});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})


//get message for the chatbox with a particular user
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

//get notifcation of follower request
app.post("/api/user/getNotification", async(req,res)=>{
    console.log("fetching notication request received")
    const userHandler=new UserHandler(req.body.userID);
    const requestResult = await userHandler.getNotifications();
    const recommendedResult = await userHandler.getRecommendedUsers();
    // console.log(requestResult);
    // console.log(recommendedResult);

    if(requestResult.success && recommendedResult.success){
        // console.log('welcome to here!');
        delete userHandler;
        return res.status(200).send({requestedUsers: requestResult.notifications, recommendedUsers: recommendedResult.recommendedUserIDs});
    }
    else if(!requestResult.success){
        delete userHandler;
        return res.status(404).send({message: requestResult.message});
    } else {
        delete userHandler;
        return res.status(404).send({message: recommendedResult.message});
    }
})

//Accept follower request api call, privacy mode support
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

//Reject follower request api call, privacy mode support
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

//Post recommendation api calls, consist of recommendation of recent popular posts, user-related posts.
app.get("/api/user/getRecentPopularPosts", async(req, res)=>{
    console.log("Recent Popular Post request received")
    const userHandler=new UserHandler();
    const result = await userHandler.getRecentPopularPosts();
    if(result.success){
        console.log(result);
        delete userHandler;
        return res.status(200).send({posts: result.modifiedPosts, isrecommended: false});
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
        return res.status(200).send({posts: result.posts, isrecommended: true});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})
//api calls to get the post from user whos the current user is following.
app.post("/api/user/getFollowingPosts", async(req, res)=>{
    console.log("Following posts request received")
    const userHandler=new UserHandler(req.body.userID);
    const result = await userHandler.getFollowingPosts();
    if(result.success){
        console.log(result);
        delete userHandler;
        return res.status(200).send({posts: result.posts, isrecommended: false});
    }
    else {
        delete userHandler;
        return res.status(404).send({message: result.message});
    }
})
//api request to access other user profile
app.post("/api/user/getUser", async(req,res)=>{
    console.log("Get User request received")
    const userHandler=new UserHandler(req.body.currentUserID);
    const targetuserProfile = await userHandler.viewProfile(req.body.targetUserID);
    const followers = await userHandler.getFollowers(req.body.targetUserID);
    const following = await userHandler.getFollowing(req.body.targetUserID);
    // console.log("number of followers: " + followers.followers);
    if(targetuserProfile.success){
        delete userHandler;
        // if (targetuserProfile.message === "Target user profile retrieved successfully") {
        //     return res.status(200).send({
        //         user:targetuserProfile.targetUser, 
        //         followersCount:followers.followers,
        //         followingCount:following.following,
        //     });
        // };
        // if (targetuserProfile.message === "User profile retrieved successfully" || targetuserProfile.message === "User is private") {
            return res.status(200).send({
                user:targetuserProfile.targetUser, 
                followersCount:followers.followers,
                followingCount:following.following,
                isFollowing: targetuserProfile.isFollowing,
            });
        // }
        
    }
    else {
        delete userHandler;
        return res.status(404).send({message: targetuserProfile.message});
    }
})

app.listen(5164,()=>{
    console.log("server started on localhost:5164");
});
