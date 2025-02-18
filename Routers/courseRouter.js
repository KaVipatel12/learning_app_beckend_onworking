const express = require("express"); 
const router = express.Router(); 
const courseController = require("../Controllers/courseController");
const { courseAccessMiddleware, isCourseModify } = require("../Middlewares/authMiddleware");

router.route("/fetchcourses").get(isCourseModify, courseController.fetchCourses)   
router.route("/fetchcoursemainpage/:courseId").get(isCourseModify, courseController.fetchCourseMainPage)
router.route("/fetchchaptersmainpage/:courseId").get(isCourseModify, courseController.fetchChaptersMainPage)
router.route("/fetchchapter/:courseId/:chapterId").get(isCourseModify, courseAccessMiddleware, courseController.fetchChapters)
router.route("/fetchcomments/:courseId/:chapterId").get(courseController.fetchChapterComments)
router.route("/fetchallreviews/:courseId").get(courseController.fetchAllReviews)

module.exports = router; 