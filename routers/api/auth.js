const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../../setup/connect").TOKEN_KEY;
const User = require('../../models/users')
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());

const userController = require("../../controllers/user")
const tokenHelper = require("../../helpers/tokenHelper")
const mailHelper = require("../../helpers/mailHelper")
const Otpcode = require('../../helpers/otpGenerator')

// @type    GET
//@route    /api/admin/login
// @desc    login router
// @access  PUBLIC
router.get("/login",tokenHelper.verifyAuth,(req,res)=>{
    res.redirect("/api/admin/update")
});

// @type    GET
//@route    /api/admin/register
// @desc    register router
// @access  PUBLIC
router.get("/register",(req,res)=>{

    res.render("register");
});

// @type    POST
//@route    /api/admin/auth/register
// @desc    starting router
// @access  PUBLIC

router.post("/auth/register",userController.validCredentials,userController.register);

// @type    GET
//@route    /api/admin/emailverification
// @desc    emailVerification router
// @access  PUBLIC

router.get("/emailverification",userController.userVerification);


// @type    POST
//@route    /api/admin/auth/login
// @desc    starting router
// @access  PUBLIC
router.post("/auth/login",userController.loginValidCredentials,userController.login);

// @type    GET
//@route    /api/admin/auth/login
// @desc    starting router
// @access  PRAVITE 

router.get("/logout",tokenHelper.verifyAuth, userController.logout )

// @type    GET
//@route    /api/admin/auth/login
// @desc    starting router
// @access  PRAVITE 

router.get("/logout",tokenHelper.verifyAuth, userController.logout )




// @type    POST
//@route    /auth/emailverification
// @desc    starting router
// @access  PUBLIC

router.get('/emailverification/resend',async(req,res)=>{

    jsonwt.verify(req.cookies.email_t, key, async(err, user) => {
        if(err){
            res.redirect("/api/admin/login");
        //    console.log(err)
        }else{
            const token = await tokenHelper.newToken();

          await  User.findOneAndUpdate({_id:user.id},{uuidCode : token},{new:true})
                    .then((result)=>{

                        if(result){
                            user.token = result.uuidCode
                        }

                    }).catch((err)=>{
                        return res.render("gmailauth",{
                            message:err
                        })
                    })
            await mailHelper.sendMail(user,req.headers.host)
            .then(async (x)=>{
             await console.log(x)
             if(!x){
                 return res.render('gmailauth',{
                     error:true,
                     message : "Error in SMTP"
                 })
             }else{

                 res.render("gmailauth",{
                     error : false,
                     message : user.email,
                 
                 })
             }
            })
            .catch(err =>{

                res.render("gmailauth",{
                    error:true,
                    message :'internal error .......'
                });
            });
        }
    })
})


module.exports =router;