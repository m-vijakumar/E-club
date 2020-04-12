const express = require("express")
const bodyparser =require("body-parser")
const mongoose =require("mongoose");
const expressValidator = require('express-validator');
require('dotenv').config({path:'./.env'});
const ejs =require("ejs");
const app = express(); 
const path =require("path");
const cookieparser = require("cookie-parser");
const controllers = require("./controllers/index")
const nodemailer = require('nodemailer')
const  uuidv4 = require('uuid/v4')
// const fs = require('fs');
// const newuser = require("./models/");

const port = process.env.PORT ||5000;

app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json());

app.use(expressValidator());


app.use(express.static("./public"));
app.set("view engine","ejs");

app.use("/api/admin",require("./routers/api/auth"));
app.use("/api/admin/update",require("./routers/api/upload"));
app.use("/api/subscriber",require("./routers/api/subscriber"));

//mongodb connection 
const db =require("./setup/connect").mongodbURL;
const s =async()=>{ 
await mongoose
.connect(db,{ useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true, useUnifiedTopology: true })
.then(()=>console.log("mongodb connceted"))
.catch(err =>console.log(err))
}
s().catch(err => console.log(err))



// @type    GET
//@route    /
// @desc    starting router
// @access  PUBLIC
app.use(cookieparser());

app.get("/",controllers.getHomePage);

// app.get("/",async(req,res)=>{
    
//   var transporter =  nodemailer.createTransport({
//     host : 'smtp.gmail.com',
//     port : 587,
//     secure :false,
//     auth: {
//       user: process.env.Nodemailer_Username,
//       pass: process.env.Nodemailer_Password
//       // pass: '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'
//     }
//   }); 
  
//   var mailOptions = {
//     from: 'gitam.eclub@gmail.com',
//     to: 'munikotivijaykumar@gmail.com',
//     cc :['vijaykumar416p@gmail.com','121710307020@gmail.com'],
//     subject: 'E-club Email Verfication',
//     text: 'Hii  is Requesting this is vijay to Join in EClub Gitam and to comform is this User Please Click On this Link  \nhttp:\/erId=ase verify your email account \n Thankyou...'
//   };
  
//    return await transporter.sendMail(mailOptions)
//                 .then( (info)=>{
                 
//                     console.log('Email sent: ' + info.response);
//                     return  true
                  
//                 })
//                 .catch((err)=>{
//                   console.log('Email error: ' + err);
//                     return  false
//                 })

// });

app.get("/team",(req,res)=>{
    res.render("team")
})
app.get("/imagegallery",controllers.getphootos);


app.get('*', (req, res) => res.render("error"));
app.listen(port,console.log("server is running.........."));

module.exports=app;

