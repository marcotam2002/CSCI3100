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
//const pool = require("./database")

const app = express();
app.use(cors());
app.use(express.json());

app.get("/test",async(req, res)=>{
    res.json({message:"Hello!"});
});


app.listen(5164,()=>{
    console.log("server started on localhost:5164");
});