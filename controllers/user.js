
const User = require("../models/users");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../setup/connect").sceret;

const tokenHelper  = require("../helpers/tokenHelper")
const mailHelper  = require("../helpers/mailHelper")
exports.validCredentials = (req,res,next) =>{

    req.assert("username", "username cannot be empty.").notEmpty();
    req.assert("password", "Password cannot be empty").notEmpty();
    req.assert("password", "Must be between 6 to 20 characters").len(6,20);

    req.getValidationResult(req,res,next)
    .then((result)=>{
        if(!result.isEmpty()){
            // result.useFirstErrorOnly(req).array({useFirstErrorOnly:true});
            return res.status(400).json({
                error : 'invalid inputs'
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
                return res.status(400).json({
                    error: true,
                     msg: "USER_ALREADY_EXISTS"
                });
            }

            const token = await tokenHelper.newToken();

            let userobj ={username : username ,password:password,emailVerfication : false , uuidCode : token }
            let user = new User(userobj);
            user.save()

                .then(async()=>{
                    const payload ={
                        id:user.id,
                        username :user.username,                       
                    };
                    console.log(payload)
                     jsonwt.sign(payload, key,
                         { expiresIn: 9000000 },
                          (err, token) => {
                         res.cookie("auth_t", token, { maxAge: 90000000 });
                          res.status(200).redirect( "/");
                       });

                    return res.status(200).json({
                        error: false,
                        msg: 'okay',
                     
                    });

                    // -------------------* email verfication *-----------------------
                //     console.log(user._id + user.uuidCode)
                //     if( user._id && user.uuidCode){
                //         const userData = {
                //             id : user.id,
                //             email : user.username,
                //             token : user.uuidCode
                //         }
                //        const x = await mailHelper.sendMail(userData,req.headers.host)

                //             if(x == null){
                //                 return res.send("err") 
                //             }

                //             res.render("gmailauth",{
                //                 email : user.email,
                               
                //             })

                //     }else{
                //         return res.send("internal Error...........!")
                //     }
                    
       
                // })
        })
        .catch((err)=>{
            return res.status(500).json({
                error: true,
                msg: err.message
            });
        });
});

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
        .then((result)=>{

            if( !result || !result._id){
                return res.status(400).json({
                    error: true,
                     msg: "USER_DOESN'T_FOUND"
                });
            }else if(!result.emailVerfication){
                return res.render('gmailauth')
            }

            User.comparePassword(password,result.password)
                  .then((isMatch)=>{

                    if(isMatch){
                        const payload ={
                            id:result.id,
                            username :result.username,                       
                        };
                        jsonwt.sign(payload, key,
                            { expiresIn: 9000000 },
                             (err, token) => {
                            res.cookie("auth_t", token, { maxAge: 90000000 });
                             return res.status(200).redirect("/api/admin/update/details");
                          });
                      }else{

                        return res.status(401).json({
                            error:true,
                            msg:"invalid password or Username"
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

