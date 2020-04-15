
const Uploads = require("../models/upload");
const User = require("../models/users");
const jsonwt = require("jsonwebtoken")
const tokenKey = require("../setup/connect").TOKEN_KEY
const multer = require("multer");
const path = require("path");
const fs =require("fs");
//.... Multer .....//
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/myuploads')
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname +'-'+Date.now()+path.extname(file.originalname));
      
    }
  });
  
  exports.imageValidCredentials = (req,res,next) =>{

    req.assert("image", "Please Select the image").notEmpty();
    

    req.getValidationResult(req,res,next)
    .then((result)=>{
      console.log(result.array())
        if(!result.isEmpty()){
            // result.useFirstErrorOnly(req).array({useFirstErrorOnly:true});
            return res.status(400).render('updateinfo',{
              // result.useFirstErrorOnly();
                error : 'invalid inputs',
                message : result.array()[0].msg
            })
        }
        next();
    });
};


exports.updateVideos =async(req,res)=>{
	// let userId = req.user._id;
	let video1 = req.body.video1;
    let video2 = req.body.video2;
    
    let videoData ={video1:video1,video2:video2};  
   
  //  await Uploads
  //   .findOne({})
  //   .then((result)=>{
        
  //       if(!video1){
  //           videoData.video1 = result.video1;
  //       }
  //       if(!video2){
  //           videoData.video2 = result.video2;
  //           console.log(result.video2)
  //       }
  //   })
    // .catch((err)=>{
    //     return err
    // })

 
await Uploads
    .updateVideos(videoData)
    .then((r)=>{
        if(r == null){
            res.render("updateinfo",{
                message:r
            })
        }else{
            res.redirect("/api/admin/update");
        }
    })
    .catch((err)=>{
        console.log(err)
        return res.render('updateinfo',{
            error:true,
            message:"internall error... "
        })
    })

}
exports.deleteEvent = async(req,res)=>{

  await Uploads.findOneAndUpdate({},{$pull:{events:{_id:req.body.eventId}}})
  .then(async(r) =>{
    res.redirect("/api/admin/update")
  })
  .catch(err=>{
    res.render('updateinfo',{
      message:"issue in delete"
    })
  })
}

exports.uploadEvents = async(req,res)=>{

   let eventTitle=req.body.title;
   let eventDescription=req.body.description;
   let  eventDate=req.body.date;
    
   if(!eventDate || !eventDescription || !eventTitle){
    return res.render('updateinfo',{
        error:true,
        message:'invalid inputs'
    })
   }

   const r=await Uploads.updateEvents(eventTitle, eventDescription,eventDate)

	 if(r == null){
		 res.render('updateinfo',{
			 message:'Event not Added'
		 })
	 }else{
		res.redirect("/api/admin/update")
     }
  

}


exports.updatePhotos = async(req,res)=>{
    
  var upload = multer({ 
      storage: storage,
      fileFilter: (req,file,cb)=>{
        checkFileType(file,cb)
      }
    }).single('image');

    checkFileType = (file,cb)=>{
      const filetypes =/jpeg|jpg|png|gif/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
      const mimetype = filetypes.test(file.mimetype);

      if(mimetype && extname){
        return cb(null,true);
      }else{
        return cb("please Check The File")
      }
    }
    await upload(req, res, (err) =>{
      if (err) {
       return res.status(400).send({
          error: true,
          msg: err
        });
      } else {
        try{
          var imagepath = `${req.file.filename}`;
        }
        catch(err){
         return  res.render("updateinfo",{
           message:err
         })
        }
         Uploads.updatePhotos(imagepath)
              
              .then(async(r) =>{
                if(r == null){
                 return await fs.unlink(`./public/myuploads/${imagepath}`,(err)=>{

                    if(err) console.log(err)
                    else return res.render('updateinfo',{
                      message:"image not added"});  
                  })
                }
                console.log(r + "wefaerfawre")
                return res.status(400).redirect("/api/admin/update")
              })
              .catch(err =>{
                res.render("updateinfo",{
                  message:err
                })
              })

        
      }
    });
  

}



exports.getUploadPage = async(req,res)=>{


  var users =[];
      await Uploads
      .findOne({})
      .then(async(r)=>{
         //  r.events
        const user = jsonwt.decode(req.cookies.auth_t, tokenKey)
        
         console.log(user)
          if(user.admin){
            await User.find({admin :false}, {password: 0, _v: 0})
                      .then((result)=>{
                        result.forEach(element => {
                          let b ={id:element._id,username:element.username}
                          users.push(b);
                        });
                      })
                      
          }
          console.log(users)
         var data ={
          video1:r.video1,
          video2:r.video2,
          photos:r.photos,
          events:r.events,
          admin:user.admin,
          users:users
      }
          res.render("upload",data)
      })
      .catch( err =>{
        res.send("err")
      })

}

exports.deletePhotos = async(req,res)=>{

  await Uploads.findOneAndUpdate({},{$pull:{photos:{path:req.body.imageName}}})
  .then(async(r) =>{
    await fs.unlink(`./public/myuploads/${req.body.imageName}`,(err)=>{

      if(err) return res.send("Internal Error");  
      else return res.send("sucess");  
    })
  })
  .catch(err=>{
    res.status(500).json({
      error:true,
      meassage:'internal Error'
    })
  })
  
}

exports.getEvents = (req,res)=>{
  Uploads.getEventList()
  .then(r=>{
    console.log(r)
    res.send(r)
  })
}