const express = require("express"); 
const router = express.Router(); 
const studentController = require("../Controllers/studentController");
const { authUserMiddleware } = require("../Middlewares/authMiddleware");
const { courseAccessMiddleware } = require("../Middlewares/authMiddleware");

router.route("/fetchcategorycourses").get( authUserMiddleware ,studentController.fetchCategoryCourses)
router.route("/addcomment/:courseId/:chapterId").post( courseAccessMiddleware ,studentController.addComment)
router.route("/deletecomment/:courseId/:chapterId/:commentId").delete( courseAccessMiddleware ,studentController.deleteComment)
router.route("/fetchcomment").get( authUserMiddleware ,studentController.fetchComment)
router.route("/addreview/:courseId").post( courseAccessMiddleware,studentController.addOrUpdateReview)
router.route("/fetchreview/:courseId").get(courseAccessMiddleware ,studentController.fetchReview) 
router.route("/purchasecourse").post( authUserMiddleware,studentController.purchaseCourse)
router.route("/fetchpurchasedcourse").get( authUserMiddleware,studentController.fetchPurchasedCourse)
router.route("/cartfunctionality/:courseId").get( authUserMiddleware,studentController.cartFunctionality)
router.route("/fetchcart").get( authUserMiddleware,studentController.fetchCart)
router.route("/deleteCart/:courseId").delete( authUserMiddleware,studentController.deleteCart)
router.route("/category").post( authUserMiddleware,studentController.category)
module.exports = router; 