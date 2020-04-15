const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../../setup/connect").sceret;

const tokenHelper  = require("../../helpers/tokenHelper")
router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());

const subscriberController = require("../../controllers/subscriber")

router.post("/",subscriberController.getvalidate , subscriberController.addmessage)
router.get("/getfeedbacks",tokenHelper.verifyAuth, subscriberController.getfeeback)

router.post("/deletefeedback", subscriberController.deletefeedback)

module.exports = router;