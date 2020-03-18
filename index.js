const express = require("express")
const bodyparser =require("body-parser")
const mongoose =require("mongoose");
const expressValidator = require('express-validator');
require('dotenv').config({path:'./.env'});
const ejs =require("ejs");
const app = express(); 
const path =require("path");
const cookieparser = require("cookie-parser");

const  uuidv4 = require('uuid/v4')
// const fs = require('fs');
// const newuser = require("./models/");

const port = process.env.PORT ||5000;

app.use(bodyparser.urlencoded({extended : false}))
app.use(bodyparser.json());

app.use(expressValidator());
//     {
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//             , root    = namespace.shift()
//             , formParam = root;

//         while(namespace.length) {
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param : formParam,
//             msg   : msg,
//             value : value
//         };
//     }
// }
// ));


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

app.get("/",(req,res)=>{
//res.send("welcome");
res.json({status:req.headers.host});
// res.render("upload");

// const mail = require("./helpers/mailHelper")

// mail.sendMail({id:'fsdasf',email : '121710307020@gmail.com',token : 'dfasgefaytswfrefakusytdfUKSdfasyerukasyefr'},req.headers.host)
});

app.listen(port,console.log("server is running.........."));

module.exports=app;

