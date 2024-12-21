const express = require("express"); 
const router = express.Router(); 
const {authProviderMiddleware, courseAccessMiddleware} = require("../Middlewares/authMiddleware"); 
const {courseModifyMiddleware} = require("../Middlewares/authMiddleware"); 
const providerController = require("../Controllers/providerController"); 
const { upload } = require("../Config/multer");

router.route("/fetchcourses").get(authProviderMiddleware, providerController.fetchProviderCourses )
router.route("/addcourse").post(authProviderMiddleware, upload.single('courseImage') ,providerController.courseAddPage )
router.route("/fetchcoursemainpage/:courseId").get(courseAccessMiddleware, providerController.fetchProviderCourseMainPage )
router.route("/fetchchapters/:courseId").get(courseAccessMiddleware, providerController.fetchProviderChapters )
router.route("/fetchchaptermainpage/:chapterId").get(courseAccessMiddleware, providerController.fetchProviderChapterMainPage )
router.route("/updatecourse/:courseId").put(courseModifyMiddleware, providerController.courseUpdatePage)
router.route("/deletecourse/:courseId").delete(courseModifyMiddleware, providerController.courseDeletePage)
router.route("/addchapters/:courseId").post(courseModifyMiddleware, providerController.chapterAddPage )
router.route("/deletechapter/:courseId/:chapterId").delete(courseModifyMiddleware, providerController.chapterDeletePage )
router.route("/updatechapter/:courseId/:chapterId").put(courseModifyMiddleware, providerController.chapterUpdatePage )

module.exports = router; 