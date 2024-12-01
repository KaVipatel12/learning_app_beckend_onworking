const express = require("express"); 
const router = express.Router(); 
const studentController = require("../Controllers/studentController")
// const authMiddleware = require("../Middlewares/authMiddleware"); 

router.route("/fetchallcourses").get( studentController.fetchAllCourses)

module.exports = router; 