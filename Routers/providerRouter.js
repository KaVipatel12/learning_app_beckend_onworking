const express = require("express"); 
const router = express.Router(); 
const {authProviderMiddleware} = require("../Middlewares/authMiddleware"); 
const {courseModifyMiddleware} = require("../Middlewares/authMiddleware"); 
const providerController = require("../Controllers/providerController"); 

router.route("/addcourse").post(authProviderMiddleware, providerController.courseAddPage )
router.route("/updatecourse").put(courseModifyMiddleware, providerController.courseUpdatePage)
router.route("/deletecourse").delete(courseModifyMiddleware, providerController.courseDeletePage)
router.route("/addchapters").post(courseModifyMiddleware, providerController.chapterAddPage )
router.route("/deletechapter").delete(courseModifyMiddleware, providerController.chapterDeletePage )
router.route("/updatechapter").put(courseModifyMiddleware, providerController.chapterUpdatePage )

module.exports = router; 