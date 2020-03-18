
const Uploads = require("../models/upload");
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
  



exports.updateVideos =async(req,res)=>{
	// let userId = req.user._id;
	let video1 = req.body.video1;
    let video2 = req.body.video2;
    
    let videoData ={video1:video1,video2:video2};  
   
   await Uploads
    .findOne({})
    .then((result)=>{
        
        if(!video1){
            videoData.video1 = result.video1;
        }
        if(!video2){
            videoData.video2 = result.video2;
            console.log(result.video2)
        }
    })
    .catch((err)=>{
        return err
    })

 
await Uploads
    .updateVideos(videoData)
    .then((r)=>{
        if(r == null){
            res.json({
                message:r
            })
        }else{
            res.json({
                message:r
            })
        }
    })
    .catch((err)=>{
        console.log(err)
        return res.json({
            error:true,
            meg:"error in find"
        })
    })

}
exports.deleteEvent = async(req,res)=>{

  await Uploads.findOneAndUpdate({},{$pull:{events:{_id:req.body.eventId}}})
  .then(async(r) =>{
    res.send("done")
  })
  .catch(err=>{
    res.send(err)
  })
}

exports.uploadEvents = async(req,res)=>{

   let eventTitle=req.body.title;
   let eventDescription=req.body.description;
   let  eventDate=req.body.date;
    
   if(!eventDate || !eventDescription || !eventTitle){
    return res.json({
        error:true,
        meassage:'invalid inputs'
    })
   }

   const r=await Uploads.updateEvents(eventTitle, eventDescription,eventDate)

	 if(r == null){
		 res.json({
			 message:'Event not Added'
		 })
	 }else{
		res.json({
			message:r
		})
     }
  

}


exports.updatePhotos = async(req,res)=>{
    
  var upload = multer({ 
      storage: storage 
  
    }).single('image');

    await upload(req, res, (err) =>{
      if (err) {
        res.status(400).send({
          error: true,
          msg: err
        });
      } else {
        try{
          var imagepath = `${req.file.filename}`;
        }
        catch(err){
          res.send('file error')
        }
         Uploads.updatePhotos(imagepath)
              
              .then(async(r) =>{
                if(r == null){
                 return await fs.unlink(`./public/myuploads/${imagepath}`,(err)=>{

                    if(err) console.log(err)
                    else return res.send("image not added");  
                  })
                }
                console.log(r + "wefaerfawre")
                return res.status(400).json({
                  error:false,
                  meassage:'Photo Added Successfully' 
                })
              })
              .catch(err =>{
                res.send(err)
              })

        
      }
    });
  

}



exports.getUploadPage = async(req,res)=>{

  jsonwt.verify(req.cookies.auth_t, ekey, async(err, user1) => {
    if(err){
        res.send("internal error");
       console.log(err)
    }else{

      await Uploads
      .findOne({})
      .then(async(r)=>{
         //  r.events
         console.log(r.video1)

          res.render("upload",{
              video1:r.video1,
              video2:r.video2,
              photos:r.photos,
              events:r.events
          })
      })
      .catch( err =>{
        res.send("err")
      })
    }
         
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