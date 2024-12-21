const express = require("express"); 
const router = express.Router(); 
const studentController = require("../Controllers/studentController");
const { authUserMiddleware } = require("../Middlewares/authMiddleware");
const { courseAccessMiddleware } = require("../Middlewares/authMiddleware");

router.route("/addcomment").post( courseAccessMiddleware ,studentController.addComment)
router.route("/deletecomment").delete( courseAccessMiddleware ,studentController.deleteComment)
router.route("/fetchcomment").get( authUserMiddleware ,studentController.fetchComment)
router.route("/addreview").post( courseAccessMiddleware,studentController.addReview)
router.route("/updatereview").put( courseAccessMiddleware,studentController.updateReview)
router.route("/fetchreview").get( courseAccessMiddleware,studentController.fetchReview) 
router.route("/purchasecourse").post( authUserMiddleware,studentController.purchaseCourse)
router.route("/fetchpurchasedcourse").get( authUserMiddleware,studentController.fetchPurchasedCourse)
router.route("/cartfunctionality/:courseId").get( authUserMiddleware,studentController.cartFunctionality)
router.route("/fetchcart").get( authUserMiddleware,studentController.fetchCart)

module.exports = router; 