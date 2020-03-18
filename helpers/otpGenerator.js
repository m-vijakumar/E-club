
const rn = require('random-number')

exports.otpGenrator = ()=>{
    var charaters=[1,2,3,4,5,6,7,8,9,0,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z']
    var ecode="";
    var options = {   
        min: 0,
    max: 35,
    integer: true
    }
    for(let i=1;i<=8;i++){
        let num= rn(options);
        //console.log("num  :"+num) 
        ecode =ecode+charaters[num];
    }

    return ecode.toString();

}