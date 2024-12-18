const express = require("express"); 
const router = express.Router(); 
const courseController = require("../Controllers/courseController");
const { authUserMiddleware } = require("../Middlewares/authMiddleware");
const { courseAccessMiddleware } = require("../Middlewares/authMiddleware");

router.route("/fetchcourses").get(courseController.fetchCourses)   
router.route("/fetchcoursemainpage/:courseId").get(courseController.fetchCourseMainPage)
router.route("/fetchchaptersmainpage/:courseId").get( courseController.fetchChaptersMainPage)
router.route("/fetchchapter/:chapterId").get(courseAccessMiddleware, courseController.fetchChapters)
router.route("/fetchcomments").get( courseAccessMiddleware ,courseController.fetchChapterComments)
router.route("/fetchallreviews").get(courseController.fetchAllReviews)

module.exports = router; 