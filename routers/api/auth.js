const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");

// const bcrypt=require("bcryptjs");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../../setup/connect").sceret;
// const ekey ="emailkey";
const rn=require("random-number");

router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());
// const newusers= require("../../models/users");

const userController = require("../../controllers/user")
const Otpcode = require('../../helpers/otpGenerator')


//HOME PAGE
router.get("/",(req,res)=> {
    //res.send("welcome");
    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
        if(err){
        return res.render("home");
        }
        else{
            res.redirect("/dashboard");
        }
      })
    
});

// @type    POST
//@route    /login
// @desc    starting router
// @access  PUBLIC
router.get("/login",(req,res)=>{

    res.render("login");
});

// @type    POST
//@route    /register
// @desc    starting router
// @access  PUBLIC
router.get("/register",(req,res)=>{

    res.render("register");
});

// @type    POST
//@route    /auth/register
// @desc    starting router
// @access  PUBLIC

router.post("/auth/register",userController.validCredentials,userController.register);

// @type    POST
//@route    /emailverification
// @desc    starting router
// @access  PUBLIC

router.get("/emailverification",userController.userVerification);

// @type    POST
//@route    /auth/emailverification
// @desc    starting router
// @access  PUBLIC



router.post('/auth/emailverification',(req,res)=>{

    var reqcode=req.body.emailcode;
    jsonwt.verify(req.cookies.email_t, ekey, (err, user1) => {
        if(err){
            res.send("internal error");
           console.log(err)
        }else{

            if(code==reqcode){
                newusers.findOne({email:user1.email})
         .then(newuser =>{
         if(newuser){
             return res.render("register",{
                 message:'User is Already Registered'});
         }else{
             const Newuser =new newusers({
                 username: user1.username,
                 email:user1.email,
                password: user1.password,
             });
             Newuser
             .save()
             .then(  res.clearCookie("email_t").redirect("/login") )
             .catch(err => console.log(err));
            
         }    
     })
     .catch(err =>{

        res.render("register",{
             message :'internal error .......'
         });
     });
     } else{

       return res.render("gmailauth",{
            email :user1.email,
            errormessage : "invalid code"
        });

        }
    }

    });

});


// @type    POST
//@route    /auth/login
// @desc    starting router
// @access  PUBLIC
router.post("/auth/login",userController.validCredentials,userController.login);


router.get("/logout", (req, res) => {
    jsonwt.verify(req.cookies.auth_t, key, (err, user) => {
      if (user) {
        res.clearCookie("auth_t").redirect("/")
        
      } else {
        return res
        .status(404)
        .json({ done: 0 });
      }
    });
  });


module.exports =router;