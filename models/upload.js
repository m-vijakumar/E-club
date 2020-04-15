const mongoose = require("mongoose");

const uploadSchema = new mongoose.Schema({
    video1:{type: String , default:null},
    video2:{type: String , default: null},
    
    photos :[{
        path:{type: String , required: true}
    }],
    events :[{ 
        eventTitle:{type: String , default: null},
        eventDescription:{type: String , default: null},
        eventDate:{type: Date , default: Date.now},
       
    }]
})

uploadSchema.statics.updatePhotos = async(imagePath)=>{

var photo = {path:imagePath}
    return await Uploads.findOneAndUpdate({},{ $push: { photos:photo} },{new : true})
            .then(result =>{
                console.log(result)
                return result;
            })
            .catch(err=>{
                return null
            })
}

uploadSchema.statics.updateVideos = async(videoData)=>{
    
    return await Uploads
            .findOneAndUpdate({},{$set:videoData},{new : true})
            .then(async(result)=>{
                // console.log(result);
                if(!result){
                    let video = new Uploads(videoData);
                     return await video.save()
                        .then(result =>{
                            // console.log(result);
                            return result
                        })
                        .catch(err =>{
                            return err
                        }) 
                }else{
                    console.log(result);
                    return result
                }

            })
            .catch((err)=>{
                return err;
            })
}


uploadSchema.statics.updateEvents= async(eventTitle,eventDescription,eventDate)=>{
  let  eventdata = {eventTitle:eventTitle,eventDescription:eventDescription,eventDate: new Date(eventDate)}
    return await Uploads
            .findOneAndUpdate({},{ $push: { events: eventdata} },{new : true})
            .then(async(result)=>{
                // console.log(result);
                if(!result){
                    let event = new Uploads(eventdata);
                     return await event.save()
                        .then(result =>{
                            // console.log(result);
                            return result
                        })
                        .catch(err =>{
                            return err
                        }) 
                }else{
                    console.log(result);
                    return result
                }

            })
            .catch((err)=>{
                return err;
            })

}

uploadSchema.statics.getEventList= async() =>{

    var past =[];
    var future =[];
   return await Uploads.findOne({})
    .then((result)=>{
        result.events.forEach(element => {
              let  date1 = element.eventDate.toString();
              let date2 = date1.split(" ");

               let date = ""+date2[0]+" "+date2[1]+" "+date2[2]+" "+date2[3];


            var x= {
                eventDescription:element.eventDescription,
                eventTitle:element.eventTitle,
                eventDate:date
            }

            if(element.eventDate < Date.now() ){
                past.push(x)
                

                
                console.log('past    '+x)
            }else{
                future.push(x)
                console.log('future     '+x)
            }

        });
        var events = {
            past :past,
            future:future
        }
        return events ;
    })
    .catch((err)=>{
        console.log(err)
        var events = {
            past :past,
            future:future
        }
        return events ;
    })
}
 module.exports = Uploads = mongoose.model('uploads',uploadSchema);