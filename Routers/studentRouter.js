const express = require("express"); 
const router = express.Router(); 
const studentController = require("../Controllers/studentController");
const { authUserMiddleware } = require("../Middlewares/authMiddleware");

router.route("/addcomment").post( authUserMiddleware ,studentController.addComment)
router.route("/deletecomment").delete( authUserMiddleware ,studentController.deleteComment)
router.route("/addreview").post( authUserMiddleware,studentController.addReview)
router.route("/updatereview").put( authUserMiddleware,studentController.updateReview)
router.route("/fetchreview").get( authUserMiddleware,studentController.fetchReview) 
router.route("/purchasecourse").get( authUserMiddleware,studentController.purchaseCourse)
router.route("/fetchpurchasedcourse").get( authUserMiddleware,studentController.fetchPurchasedCourse)

module.exports = router; 