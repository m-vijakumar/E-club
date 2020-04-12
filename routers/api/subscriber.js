const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");

// const bcrypt=require("bcryptjs");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../../setup/connect").sceret;

router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());
// const newusers= require("../../models/users");

const userController = require("../../controllers/user")

// router.post("/",userController)

module.exports = router