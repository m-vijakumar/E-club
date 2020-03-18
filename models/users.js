const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username : {type: String , required: true},
    password : {type: String , required: true},
    emailVerfication : {type: Boolean , default : false},
    uuidCode : {type : String , default :null }
});

userSchema.pre('save', function(next) {
    var user = this;
    const saltRounds = 12;

    if (!user.isModified('password')) {
        return next();
    }
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        // debug(hash, user.password,"err: ", err);
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.statics.comparePassword = (input_password,current_password)=>{

    return bcrypt.compare(input_password,current_password)
}

userSchema.statics.checkIfUserExists = async(username)=>{

  return await User
    .findOne({username:username})
    .then((result)=>{
        console.log(result)
        return result;
    })
    .catch(()=>{
        throw err;
    })
};
userSchema.statics.checkIfUserExistsWithId = async(userId)=>{

  return await User
    .findOne({_id:userId})
    .then((result)=>{
        console.log(result)
        return result;
    })
    .catch(()=>{
        throw err;
    })
};

userSchema.statics.updateStatus = async(userId)=>{
    return await User
    .findOneAndUpdate({_id:userId},{$set:{emailVerfication : true,uuidCode : null}},{new : true})
    .then((result)=>{
        console.log(result)
        return result;
    })
    .catch(()=>{
        throw err;
    })
}
const User = module.exports = mongoose.model('user', userSchema);