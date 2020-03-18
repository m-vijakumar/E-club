const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({

    subscribers :[{
        email_id:{type: String , required: true}
    }],
    
})

module.exports = subscribers = mongoose.model('subscribers',subscriberSchema)