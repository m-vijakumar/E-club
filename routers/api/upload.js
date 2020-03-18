
const express=require("express");
const router =express.Router();
const bodyparser=require("body-parser");
const jsonwt =require("jsonwebtoken");
const cookie =require("cookie-parser");
const key =require("../../setup/connect").sceret;

const uploadController = require("../../controllers/upload")

router.use(bodyparser.urlencoded({extended:false}));
router.use(bodyparser.json());
router.use(cookie());

router.post("/photos",uploadController.updatePhotos)

// router.get("/videos",)
router.post("/videos",uploadController.updateVideos)

router.post("/events",uploadController.uploadEvents)
router.get("/details",uploadController.getUploadPage)

router.post("/delete/event",uploadController.deleteEvent)
router.post("/delete/photo",uploadController.deletePhotos)
module.exports = router;
