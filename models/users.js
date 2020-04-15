const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
    username : {type: String , required: true},
    password : {type: String , required: true},
    adminVerfication : {type: Boolean , default : false},
    emailVerfication : {type: Boolean , default : false},
    admin:{type :Boolean ,default :false},
    uuidCode : {type : String , default :null }
});

userSchema.pre('save', function(next){
    var user = this;
    const saltRounds = 12;

    if (!user.isModified('password')) {
        console.log("password not modified")
        return next();
    }
    bcrypt.hash(user.password, saltRounds, function(err, hash) {
        console.log("password  modified")
        if (err) {
            return next(err);
        }
        user.password = hash;
        next();
    });
});

userSchema.statics.changePassword = async(userId,password)=>{

    const saltRounds = 12;
    bcrypt.hash(password, saltRounds, function(err, hash) {
        
        if (err) {
            return next(err);
        }
        console.log("password  modified")
        password = hash;
       
    });

    return await User
    .findOneAndUpdate({_id:userId},{password:password},{new:true})
    .then((result)=>{
    
        console.log(result)
        return result;
    })
    .catch((err)=>{
        throw err;
    })
}

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
userSchema.statics.deleteUser = async(userId)=>{

   return await User
    .deleteOne({_id:userId})
    .then((r)=>{
        console.log(r)
        return true

    })
    .catch((err)=>{
        console.log(err)
        return false
    })
}
const User = module.exports = mongoose.model('user', userSchema);