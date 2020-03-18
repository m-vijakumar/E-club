
const jsonwt = require('jsonwebtoken')

const  uuidv4 =require('uuid/v4');


exports.newToken = () =>{

    try{
    const token =uuidv4();
    console.log(token)
    return token
    }
    catch(err){
        return null
    }
}
