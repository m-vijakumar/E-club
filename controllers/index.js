
const Uploads = require('../models/upload')

exports.getphootos = async(req,res)=>{

  await Uploads
      .findOne({})
      .then(async(r)=>{
        let x;
        let y;

        try{
          var v= r.video1.split("=");
          x=v[1];
           v= r.video2.split("=");
          y=v[1];
        }
        catch(e){
          var data ={
            video1:x,
            video2:y,
            photos:r.photos,
        }
        return res.render("imagegallery",data)
        }
        var data ={
            video1:x,
            video2:y,
            photos:r.photos,
        }
        console.log(data)
        return res.render("imagegallery",data)
      })
      .catch( err =>{
        res.send(err)
      })
}

exports.getHomePage = async(req,res)=>{
    var events ;
    await Uploads.getEventList()
    .then(r=>{
      console.log(r)
      events = r
    });
    await Uploads
      .findOne({})
      .then(async(r)=>{
        var data ={
            video1:r.video1,
            video2:r.video2,
            photos:r.photos,
            pastEvents:events.past,
            futureEvents:events.future
            
        }
        console.log(data)
        return res.render("Home",data)
      })
      .catch( err =>{
        res.send("err")
      })
}