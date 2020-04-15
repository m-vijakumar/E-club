
const User = require("../models/users");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../setup/connect").TOKEN_KEY;

const tokenHelper  = require("../helpers/tokenHelper")
const mailHelper  = require("../helpers/mailHelper")
exports.validCredentials = (req,res,next) =>{

    req.assert("username", "Email cannot be empty.").notEmpty();
    req.assert("username", "invalied Email").isEmail();
    req.assert("password", "Password cannot be empty").notEmpty();
    req.assert("password", "Password must be greater then 6 characters").len(6,20);

    req.getValidationResult(req,res,next)
    .then((result)=>{
        if(!result.isEmpty()){
            // result.useFirstErrorOnly();.array({useFirstErrorOnly:true});
           console.log( result.array()[0].msg)
            return res.status(400).render('register',{
                error : 'invalid inputs',
                message : result.array()[0].msg
            })
        }
        next();
    });
};
exports.loginValidCredentials = (req,res,next) =>{

    req.assert("username", "Email cannot be empty.").notEmpty();
    req.assert("username", "invalied Email").isEmail();
    req.assert("password", "Password cannot be empty").notEmpty();
    req.assert("password", "Invailed Email Or password").len(6,20);

    req.getValidationResult(req,res,next)
    .then((result)=>{
        if(!result.isEmpty()){
            // result.useFirstErrorOnly();.array({useFirstErrorOnly:true});
           console.log( result.array()[0].msg)
            return res.status(400).render('login',{
                error : 'invalid inputs',
                message : result.array()[0].msg
            })
        }
        next();
    });
};

exports.register = (req,res) =>{

    const username = req.body.username;
    const password = req.body.password;
   
    User.checkIfUserExists(username)
        .then(async(result)=>{
            // console.log(result+"&&"+result)
            if(result && result._id){
                // console.log(result+"&&"+result._id)
                return res.status(400).render('register',{
                    error: true,
                     message: "USER_ALREADY_EXISTS"
                });
            }

            const token = await tokenHelper.newToken();

            let userobj ={username : username ,password:password,emailVerfication : false , uuidCode : token }
            let user = new User(userobj);
            user.save()

                .then(async()=>{
                    var admin;
                    await User.findOne({admin:true})
                              .then((result)=>{
                                admin = result.username
                              })
                              .catch((err)=>{
                                return res.render('regmailauth',{
                                    error:true,
                                    message : "Internal Error..........."
                                })
                              })
                    if( user._id && user.uuidCode){
                        const userData = {
                            id : user.id,
                            email : user.username,
                            admin :admin,
                            token : user.uuidCode
                        }
                        jsonwt.sign(userData, key,
                            { expiresIn: 9000000 },
                             async(err, token) => {
                                 if(err){
                                    return res.render('error',{
                                        error:true,
                                        message : "Account Is Not Verifed" 
                                    })
                                 }
                            res.cookie("email_r", token, { maxAge: 90000000 })
                            

                            await mailHelper.sendMail(userData,req.headers.host)
                            .then(async (x)=>{
                             await console.log(x)
                             if(!x){
                                 return res.render('regmailauth',{
                                     error:true,
                                     message : "Error in SMTP"
                                 })
                             }else{
     
                                 res.render("regmailauth",{
                                     error : false,
                                     message : user.email,
                                 
                                 })
                             }
                            })
                          });
                 
                    }else{
                        return res.render("register",{
                            message:"internal Error...........!"}
                            )
                    }

                })
        })
        .catch((err)=>{
            return res.status(500).json({
                error: true,
                msg: err.message
            });
        });
};

exports.deleteUser = async(req,res)=>{

    const userId =req.body.userid;
    if(!userId){
        return res.redirect("/api/admin/login")
    }

    await User.deleteUser(userId)

            .then((r)=>{
                if(r){
                    return res.redirect("/api/admin/update")
                }
            })
            .catch( (err) =>{
                return res.render("updateinfo",{
                    error :true,
                    message :"internal Error........"
                })
            })
}
exports.userVerification =(req,res)=>{

    // console.log(req.query('tokenId'))
    const token = req.param('tokenId')
    const userId = req.param('userId')
    User.checkIfUserExistsWithId(userId)
        .then((result)=>{
            if(result && result._id){
                // console.log(result+"&&"+result._id)
                if(result.uuidCode == token){
                    User.updateStatus(userId)
                        .then((result)=>{
                           return res.json({
                                error:false,
                                message : 'emailVerfication done'
                            })
                        })
                        .catch(err =>{
                           return res.json({
                                error:true,
                                message_occur:'UPDATESTAUS CATCH',
                                message : err
                            })
                        })
                }else{

                   return res.json({
                        error: true,
                        message_occur:'if uuidcode',
                        message:'please Check the link'
                    })
                }

            }else{
                return res.json({
                    error: true,
                    message_occur:'else result id',
                    message:'please Check the link'
                })
            }
        })
        .catch(err =>{
            return res.json({
                error: true,
                message_occur:'last CATCH',
                message:err
            })
        })
}

exports.login= (req,res)=>{

    const username = req.body.username;
    const password =req.body.password;

    User.checkIfUserExists(username)
        .then(async(result)=>{

            if( !result || !result._id){
                return res.render('login',{
                    error: true,
                     message: "USER_DOESN'T_FOUND"
                });
            }else if(!result.emailVerfication){
                
                var admin;
                await User.findOne({admin:true})
                          .then((r)=>{
                            admin = r.username
                          })
                          .catch((err)=>{
                            return res.render('regmailauth',{
                                error:true,
                                message : "Internal Error..........."
                            })
                          })
                if( result._id && result.uuidCode){
                    const userData = {
                        id : result.id,
                        email : result.username,
                        admin :admin,
                        token : result.uuidCode
                    }
                    jsonwt.sign(userData, key,
                        { expiresIn: 9000000 },
                         async(err, token) => {
                             if(err){
                                return res.render('error',{
                                    error:true,
                                    message : "Account Is Not Verifed" 
                                })
                             }
                        res.cookie("email_t", token, { maxAge: 90000000 })

                    return res.render('gmailauth',{
                        error:true,
                        message : "Account Is Not Verifed" 
                    })

                  });
                
            }
        }
            User.comparePassword(password,result.password)
                  .then((isMatch)=>{

                    if(isMatch){
                        const payload ={
                            id:result.id,
                            username :result.username,
                            admin:result.admin 
                        };
                        jsonwt.sign(payload, key,
                            { expiresIn: 9000000 },
                             (err, token) => {
                                if(err){
                                    return res.render('error',{
                                        error:true,
                                        message : "Internall Error" 
                                    })
                                 }
                            res.cookie("auth_t", token, { maxAge: 90000000 })
                             return res.status(200).redirect("/api/admin/update");
                          });
                      }else{

                        return res.status(401).render('login',{
                            error:true,
                            message:"invalid Email or Password"
                        })
                      }

                    })
                    .catch((err)=>{
                        return res.send({
                            error: true,
                            msg:err
                        });
                    })
        })

};

exports.logout =(req,res)=>{
    res.clearCookie("auth_t").redirect("/api/admin/login")
}