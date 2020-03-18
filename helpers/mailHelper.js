 
 const nodemailer = require("nodemailer")

 exports.sendMail = (user,host)=>{

  var transporter = nodemailer.createTransport({
    host : 'smtp.gmail.com',
    port : 587,
    secure :false,
    auth: {
      user: process.env.Nodemailer_Username,
      pass: process.env.Nodemailer_Password
      // pass: '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'
    }
  });
  
  var mailOptions = {
    from: 'gitam.eclub@gmail.com' ,
    to: '121710307020@gitam.in',
    subject: 'E-club Email Verfication',
    text: 'Welcome to EClub Gitam  this mail is to comform your email addresss \nhttp:\/\/' + host + '\/api/admin/emailverification\/?userId='+ user.id +'&tokenId=' + user.token + '\n please verify your email account \n Thankyou...'
  };
  
  transporter.sendMail(mailOptions, (error, info)=>{
    if (error) {
      console.log(error);
      return null 
      // res.send("error")
    } else {
      console.log('Email sent: ' + info.response);
      return done
    }
  });


 }

 



  // sgMail.setApiKey('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');
  // const msg = {
  // to: user.email,
  // from: 'vijaykumar416p@gmail.com',
  // subject: 'proxynotes',
  // text: `sample proxy notes ${  code }`,
  // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  // };
  // sgMail.send(msg)
  // .then(send =>{

  //     console.log(send)
  //     return res.render("gmailauth",{
  //                         email : user.email,                                  
  //                     })

  // })
  // .catch(err =>{
      
  //     console.log(err);
  //     res.render("error");
  // } )w