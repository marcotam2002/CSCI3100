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
        return res.status(500).send({message:loginResult.message});
    } else {
        console.log(loginResult.message);
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
        return res.status(200).send();
    }
    else if(result.message=='Username already taken'){
        return res.status(403).send(result.message);
    }
    else return res.status(500).send("System Error");
});

app.post("/api/user/forgetpw", async(req, res)=>{
    console.log("Forget password request received")
    const userHandler=new UserHandler();
    const result = await userHandler.checkSecurityAnswer(req.body.username, req.body.securityAnswers);
    //console.log(result)
    if(result){
        console.log("Security Answer Correct");
        return res.status(200).send();
    }
    else return res.status(404).send({message:"Error checking answer"});
});

app.put("/api/user/forgetpw/changepw", async(req, res)=>{
    console.log("change password request received")
    const userHandler=new UserHandler();
    const result = await userHandler.resetPassword(req.body.username, req.body.password);
    if(result.success){
        console.log("password changed")
        return res.status(200).send();
    }
    else return res.status(403).send({message:result.message});
});

//Code tested halfway
app.post("/api/user/addpost", async(req, res)=>{
    console.log("Add Post request received")
    const userHandler=new UserHandler();
    const result = await userHandler.createPost(req.body.userID,req.body.description, req.body.fileURL);    //test without media first
    if(result.success){
        console.log("New Post added to database");
        return res.status(200).send();
    }
    else return res.status(404).send({message: result.message});
})

/*
app.get("/api/homepage", async(req,res)=>{
    console.log("Fetching post from server")
    const userHandler=new UserHandler();
    const result = await userHandler.getPost();    //??????? Do we have a function to get a bunch of posts to the homepage?
})*/

app.listen(5164,()=>{
    console.log("server started on localhost:5164");
});