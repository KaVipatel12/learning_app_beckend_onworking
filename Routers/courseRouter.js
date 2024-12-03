const express = require("express"); 
const router = express.Router(); 
const courseController = require("../Controllers/courseController");
const { authUserMiddleware } = require("../Middlewares/authMiddleware");

router.route("/fetchcourses").get(courseController.fetchCourses)   
router.route("/fetchcoursemainpage").get(courseController.fetchCourseMainPage)
router.route("/fetchchaptersmainpage").get( courseController.fetchChaptersMainPage)
router.route("/fetchchapter").get(courseController.fetchChapters)
router.route("/fetchcomments").get( authUserMiddleware ,courseController.fetchChapterComments)

module.exports = router; 