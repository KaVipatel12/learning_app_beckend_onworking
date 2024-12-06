const express = require("express"); 
const router = express.Router(); 
const adminController = require("../Controllers/adminController")
const {authAdminMiddleware} = require("../Middlewares/authMiddleware"); 

router.route("/userlists").get(authAdminMiddleware, adminController.fetchUsers); 
router.route("/deleteuser").delete(authAdminMiddleware, adminController.deleteUser); 
router.route("/providerlists").get(authAdminMiddleware, adminController.fetchProviders); 
router.route("/deleteprovider").delete(authAdminMiddleware, adminController.deleteProvider); 

module.exports = router; 