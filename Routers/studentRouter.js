const express = require("express"); 
const router = express.Router(); 
const studentController = require("../Controllers/studentController");
const { authUserMiddleware } = require("../Middlewares/authMiddleware");

router.route("/addcomment").post( authUserMiddleware ,studentController.addComment)
router.route("/deletecomment").delete( authUserMiddleware ,studentController.deleteComment)

module.exports = router; 