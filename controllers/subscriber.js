

const Subscriber = require("../models/subscriber");

exports.getvalidate = (req,res,next)=>{

    req.assert("email", "Email cannot be empty.").notEmpty();
    req.assert("email", "please Enter Valied Email").isEmail();
    req.assert("name", "name cannot be empty").notEmpty();
    req.assert("message", "message cannot be empty").notEmpty();

    req.getValidationResult(req,res,next)
    .then(async(result)=>{
        if(!result.isEmpty()){
           console.log( result.array()[0].msg)
           console.log("WQWEWWQ");
            return res.render('feedback',{
                error : 'invalid inputs',
                err : result.array()[0].msg
            })
        }
        next();
    });
};


exports.addmessage = async(req,res)=>{

    let data ={
        name:req.body.name,
        emailId:req.body.email,
        message:req.body.message

    }
    let sub = new Subscriber(data);
            sub.save()
            .then((result)=>{
                console.log("FFFFFF");
                 return res.render('feedback',{
                     message : "Thank you For Your Feedback...",

                 })
            })
            .catch((err)=>{
                console.log("GGGGGG");
                return res.render('feedback',{
                    err : "Internal Error...",
                })
            })

}

exports.getfeeback = (req,res)=>{

    Subscriber.find({})
    .then((result)=>{
        console.log(result)
        res.render('updatefeedback',{
            feedbacks:result
        })
    })
    .catch((err)=>{
        console.log(err)
        res.render('updateinfo',{
            message:err
        })
    })
}

exports.deletefeedback = (req,res)=>{

    Subscriber.deleteOne({_id :req.body.feedbackId },{new:true})
        .then((result)=>{
            res.redirect("/api/subscriber/getfeedbacks");
        })
        .catch((err)=>{
            res.render("updateinfo",{
                message:err
            })
        })
}