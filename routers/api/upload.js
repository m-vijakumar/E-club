
const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../../setup/connect").sceret;

const uploadController = require("../../controllers/upload")
const userController = require("../../controllers/user")
const tokenHelper = require('../../helpers/tokenHelper')

router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());

router.get("/",tokenHelper.verifyAuth,uploadController.getUploadPage)
router.post("/photos",uploadController.updatePhotos)

// router.get("/videos",)
router.post("/videos",uploadController.updateVideos)

router.post("/events",uploadController.uploadEvents)
router.get("/details",uploadController.getEvents)

router.post("/delete/event",uploadController.deleteEvent)
router.post("/delete/photo",uploadController.deletePhotos)
router.post("/delete/user",tokenHelper.verifyAdminAuth,userController.deleteUser)
module.exports = router;
