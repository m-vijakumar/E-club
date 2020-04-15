const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({

        name:{type :String ,required :true},
        emailId:{type: String , required: true},
        message:{type:String ,require:true}
})



module.exports = subscribers = mongoose.model('subscribers',subscriberSchema)