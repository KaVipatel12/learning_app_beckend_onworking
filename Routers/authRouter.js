const express = require("express"); 
const router = express.Router(); 
const authController = require("../Controllers/authController")
const signupSchema = require("../Validators/authValidator")
const {validate} = require("../Middlewares/validateMiddleware")
const {authProviderMiddleware} = require("../Middlewares/authMiddleware"); 
const {authUserMiddleware} = require("../Middlewares/authMiddleware"); 

router.route("/register").post(validate(signupSchema), authController.register)
router.route("/login").post(authController.login)
router.route("/educator/profile").get(authProviderMiddleware, authController.providerProfile)
router.route("/user/profile").get(authUserMiddleware, authController.userProfile)
// router.post('/emailverification', authController.sendOtpEmail);
// router.post('/otpverification', authController.otpVerification); 
// router.post('/updatepassword', authController.newPassword); 

module.exports = router; 