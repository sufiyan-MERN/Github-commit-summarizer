import express from "express"
import { main } from "./index.js";

const app= express()

app.get("/summarisecommit", async (req,res)=>{

    const {githubURL}=req.query
    console.log("github url from cilent",githubURL);
    
    const data= await main(githubURL)

    res.json({
        msg:"get request received",
        data
    })
})


app.listen("8080",()=>{
    console.log("server is running at port 8080");
})