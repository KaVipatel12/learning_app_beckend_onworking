const express = require("express"); 
const router = express.Router(); 
const {authProviderMiddleware} = require("../Middlewares/authMiddleware"); 
const providerController = require("../Controllers/providerController"); 

router.route("/addcourse").post(authProviderMiddleware, providerController.courseAddPage )
router.route("/updatecourse").put(authProviderMiddleware, providerController.courseUpdatePage)
router.route("/deletecourse").delete(authProviderMiddleware, providerController.courseDeletePage)
router.route("/addchapters").post(authProviderMiddleware, providerController.chapterAddPage )
router.route("/deletechapter").delete(authProviderMiddleware, providerController.chapterDeletePage )
router.route("/updatechapter").put(authProviderMiddleware, providerController.chapterUpdatePage )

module.exports = router; 